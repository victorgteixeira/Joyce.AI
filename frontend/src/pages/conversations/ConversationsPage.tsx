import { useState, useEffect } from 'react';
import { FiMessageSquare, FiTrash2, FiEdit2, FiPlus, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ConversationService, { type Conversation } from '../../services/conversation.service';

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingConversation, setEditingConversation] = useState<Conversation | null>(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ConversationService.getUserConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        await ConversationService.deleteConversation(id);
        await fetchConversations();
      } catch (err) {
        console.error('Error deleting conversation:', err);
        setError('Failed to delete conversation');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditingTitle = (conversation: Conversation) => {
    setEditingConversation(conversation);
    setNewTitle(conversation.title);
  };

  const handleUpdateTitle = async () => {
    if (!editingConversation) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await ConversationService.updateConversationTitle(editingConversation.id, newTitle);
      await fetchConversations();
      setEditingConversation(null);
    } catch (err) {
      console.error('Error updating conversation title:', err);
      setError('Failed to update conversation title');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {/* Full screen background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 z-0">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>
      </div>
      
      <MainLayout>
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Suas Conversas
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Gerencie e continue suas conversas com a Joyce.AI
              </p>
            </div>
            <Link
              to="/chat/new"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPlus className="mr-2 h-5 w-5" />
              Nova Conversa
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl relative mb-6 animate-shake" role="alert">
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          {/* Main content area with proper container */}
          <div className="flex-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
            <div className="flex items-center mb-6">
              <FiMessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Suas Conversas
              </h2>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
              </div>
            ) : conversations.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/70 dark:border-gray-700/70 overflow-hidden group hover:scale-[1.02]">
                    <div className="p-6">
                      {editingConversation?.id === conversation.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                            autoFocus
                          />
                          <div className="flex space-x-3">
                            <button
                              onClick={handleUpdateTitle}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => setEditingConversation(null)}
                              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Link to={`/chat/${conversation.id}`} className="block group-hover:scale-[1.01] transition-transform duration-200">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                                {conversation.title}
                              </h3>
                              <div className="ml-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                                <FiMessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <FiClock className="w-4 h-4 mr-2" />
                              {formatDate(conversation.updatedAt)}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                              {conversation.messages && conversation.messages.length > 0 
                                ? conversation.messages[conversation.messages.length - 1].content.substring(0, 120) + '...'
                                : 'Nenhuma mensagem ainda'}
                            </p>
                          </Link>
                          
                          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                              onClick={() => startEditingTitle(conversation)}
                              className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                              title="Editar título"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConversation(conversation.id)}
                              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                              title="Excluir conversa"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-6">
                  <FiMessageSquare className="w-16 h-16 mx-auto text-blue-500 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Nenhuma conversa ainda
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                    Comece uma nova conversa com a Joyce.AI e explore todo o potencial da inteligência artificial
                  </p>
                  <Link
                    to="/chat/new"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    <FiPlus className="mr-2 h-5 w-5" />
                    Iniciar Nova Conversa
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ConversationsPage;