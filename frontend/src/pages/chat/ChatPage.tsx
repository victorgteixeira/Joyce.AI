import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiBookOpen, FiMessageCircle, FiSave, FiX, FiUser } from 'react-icons/fi';
import MainLayout from '../../components/layout/MainLayout';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import PromptSidebar from '../../components/chat/PromptSidebar';
import { AuthContext } from '../../contexts/AuthContext';
import AIService from '../../services/ai.service';
import ConversationService, { type Conversation, type Message } from '../../services/conversation.service';
import PromptService, { type Prompt } from '../../services/prompt.service';

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Lê o contexto e guarda o usuário (pode ser null/undefined)
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  const authLoading = auth?.isLoading || false;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [showPromptSidebar, setShowPromptSidebar] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Se não houver usuário logado, redireciona para login
  useEffect(() => {
    // Só redireciona se não estiver carregando e não houver usuário
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Carrega conversa existente e prompts
  useEffect(() => {
    if (!user) return; // aguarda autenticação

    // Limpa estado anterior ao mudar de conversa
    setConversation(null);
    setMessages([]);
    setError(null);
    setEditingTitle(false);
    setShowPromptSidebar(false);

    const fetchData = async () => {
      setIsLoading(true);
        
        try {
          if (id && id !== 'new') {
            try {
              const conversationData = await ConversationService.getConversationById(id);
              
              // Verifica se a conversa foi carregada corretamente
              if (conversationData && conversationData.id) {
                setConversation(conversationData);
                // Garante que as mensagens sejam um array válido
                const messages = Array.isArray(conversationData.messages) ? conversationData.messages : [];
                setMessages(messages);
                const title = conversationData.title || 'Conversa sem título';
                setNewTitle(title);
              } else {
                console.warn('Conversa não encontrada ou dados inválidos');
                // Não cria nova conversa automaticamente, apenas limpa o estado
                setConversation(null);
                setMessages([]);
                navigate('/chat/new', { replace: true });
              }
            } catch (convErr) {
              console.error('Erro ao carregar conversa:', convErr);
              // Se a conversa não existe ou há erro, redireciona para nova conversa
              setConversation(null);
              setMessages([]);
              navigate('/chat/new', { replace: true });
            }
          }
          // Para id === 'new', não cria conversa automaticamente
          // A conversa será criada apenas quando o usuário enviar a primeira mensagem

        // Carrega prompts separadamente para não bloquear o chat
        try {
          const userPrompts = await PromptService.getUserPrompts();
          setPrompts(userPrompts);
        } catch (promptErr) {
          console.error('Error loading prompts:', promptErr);
          // Não bloqueia o chat se os prompts falharem
          setPrompts([]);
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load conversation');
        navigate('/chat/new', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, user]);

  // Título da aba
  useEffect(() => {
    if (conversation) {
      document.title = `${conversation.title} - Joyce.AI`;
    } else {
      document.title = 'Nova Conversa - Joyce.AI';
    }
    return () => {
      document.title = 'Joyce.AI';
    };
  }, [conversation]);

  // Scroll ao final ao mudar mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewConversation = async () => {
    if (!user) return null;
    setIsLoading(true);
    setError(null);

    try {
      const defaultTitle = `Nova conversa (${user.email ?? 'Você'}) ${new Date().toLocaleDateString('pt-BR')}`;
      const newConv = await ConversationService.createConversation({ title: defaultTitle });
      setConversation(newConv);
      setMessages([]);
      setNewTitle(newConv.title);
      navigate(`/chat/${newConv.id}`, { replace: true });
      return newConv;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Failed to create new conversation');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTitle = async (title: string) => {
    if (!conversation || !title.trim()) return;

    try {
      await ConversationService.updateConversationTitle(conversation.id, title);
      setConversation({ ...conversation, title });
      setNewTitle(title);
      setEditingTitle(false);
    } catch (err) {
      console.error('Error updating title:', err);
      setError('Failed to update title');
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    let currentConversation = conversation;
    
    // Se não há conversa, cria uma nova
    if (!currentConversation) {
      currentConversation = await createNewConversation();
      if (!currentConversation) {
        setError('Failed to create conversation');
        return;
      }
    }

    // primeira mensagem?
    const isFirstUserMessage = messages.length === 0;

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      conversationId: currentConversation.id,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await AIService.chat({
        message: messageContent,
        conversationId: currentConversation.id,
        promptId: selectedPrompt || undefined,
        // se futuramente quiser enviar quem é o autor:
        // userId: user?.id,
      });

      const aiMessage: Message = {
        id: 'temp-ai-msg',
        role: 'assistant',
        content: response.message,
        conversationId: currentConversation.id,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setSelectedPrompt(null);

      // Atualiza com a conversa oficial (ids das mensagens do servidor) apenas se necessário
      try {
        const updatedConversation = await ConversationService.getConversationById(currentConversation.id);
        // Só atualiza se tiver mais mensagens no servidor do que localmente
        if (updatedConversation.messages.length >= messages.length + 2) {
          setMessages(updatedConversation.messages);
        }
      } catch (convErr) {
        console.error('Error updating conversation:', convErr);
        // Mantém as mensagens locais se falhar ao buscar do servidor
      }

      // Se for a primeira mensagem, gerar título automático
      if (isFirstUserMessage) {
        const autoTitle =
          messageContent.substring(0, 30) + (messageContent.length > 30 ? '...' : '');
        await handleUpdateTitle(autoTitle);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsePrompt = async (prompt: Prompt) => {
    if (!conversation) return;

    handleSendMessage(prompt.content);
    setShowPromptSidebar(false);

    try {
      await PromptService.incrementUsage(prompt.id);
    } catch (err) {
      console.error('Error incrementing prompt usage:', err);
    }
  };

  const handleDeleteConversation = async () => {
    if (!conversation) return;

    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await ConversationService.deleteConversation(conversation.id);
        navigate('/chat/new', { replace: true });
      } catch (err) {
        console.error('Error deleting conversation:', err);
        setError('Failed to delete conversation');
      }
    }
  };

  // Enquanto redireciona, não renderiza a página
  if (!user) return null;

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 border-b border-gray-200/50 dark:border-gray-700/50">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>
          
          <div className="relative backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 py-4 px-4 sm:py-6 sm:px-6">
            <div className="flex justify-between items-center">
              {editingTitle ? (
                <div className="flex-1 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiEdit2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all duration-200"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateTitle(newTitle)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                    >
                      <FiSave className="w-4 h-4" />
                      <span className="hidden sm:inline">Salvar</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingTitle(false);
                        setNewTitle(conversation?.title || '');
                      }}
                      className="px-4 py-2 bg-gray-200/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-all duration-200 flex items-center space-x-2 backdrop-blur-xl"
                    >
                      <FiX className="w-4 h-4" />
                      <span className="hidden sm:inline">Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {conversation?.title || 'Nova Conversa'}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Converse com a Joyce AI
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl px-3 py-2 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                  <FiUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px] md:max-w-[160px]" title={user.email}>
                    {user.email}
                  </span>
                </div>

                {!editingTitle && (
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-all duration-200"
                    title="Editar título"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={() => setShowPromptSidebar(true)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                  title="Usar prompt"
                >
                  <FiBookOpen className="w-5 h-5" />
                </button>

                <button
                  onClick={handleDeleteConversation}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                  title="Excluir conversa"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mx-2 sm:mx-4 mt-2 sm:mt-4"
            role="alert"
          >
            <span className="block sm:inline text-sm sm:text-base">{error}</span>
          </div>
        )}

        {/* Messages */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Digite sua mensagem..."
        />

        {/* Prompt sidebar */}
        <PromptSidebar
          isOpen={showPromptSidebar}
          onClose={() => setShowPromptSidebar(false)}
          onSelectPrompt={handleUsePrompt}
          prompts={prompts}
        />

        {/* âncora para scroll */}
        <div ref={messagesEndRef} />
      </div>
    </MainLayout>
  );
};

export default ChatPage;
