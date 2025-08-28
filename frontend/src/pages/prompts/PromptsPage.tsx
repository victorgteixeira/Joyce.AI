import { useState, useEffect, type FormEvent } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiBookOpen, FiStar, FiTag, FiCopy } from 'react-icons/fi';
import MainLayout from '../../components/layout/MainLayout';
import PromptService, { type Prompt, type CreatePromptData, type UpdatePromptData } from '../../services/prompt.service';

const PromptsPage = () => {
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [publicPrompts, setPublicPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'my-prompts' | 'public-prompts'>('my-prompts');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [userPromptsResult, publicPromptsResult] = await Promise.allSettled([
        PromptService.getUserPrompts(),
        PromptService.getPublicPrompts()
      ]);
      
      const userPromptsData = userPromptsResult.status === 'fulfilled' ? userPromptsResult.value : [];
      const publicPromptsData = publicPromptsResult.status === 'fulfilled' ? publicPromptsResult.value : [];
      
      if (userPromptsResult.status === 'rejected') {
        console.error('Error fetching user prompts:', userPromptsResult.reason);
      }
      if (publicPromptsResult.status === 'rejected') {
        console.error('Error fetching public prompts:', publicPromptsResult.reason);
      }
      
      setUserPrompts(userPromptsData);
      setPublicPrompts(publicPromptsData);
      
      // Só mostra erro se ambas as requisições falharam
      if (userPromptsResult.status === 'rejected' && publicPromptsResult.status === 'rejected') {
        setError('Failed to load prompts');
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError('Failed to load prompts');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDescription('');
    setTags('');
    setIsPublic(false);
    setEditingPromptId(null);
    setShowCreateForm(false);
  };

  const handleCreatePrompt = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const promptData: CreatePromptData = {
        title,
        content,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic
      };
      
      await PromptService.createPrompt(promptData);
      await fetchPrompts();
      resetForm();
    } catch (err) {
      console.error('Error creating prompt:', err);
      setError('Failed to create prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrompt = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPromptId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const promptData: UpdatePromptData = {
        title,
        content,
        description,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        isPublic
      };
      
      await PromptService.updatePrompt(editingPromptId, promptData);
      await fetchPrompts();
      resetForm();
    } catch (err) {
      console.error('Error updating prompt:', err);
      setError('Failed to update prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        await PromptService.deletePrompt(id);
        await fetchPrompts();
      } catch (err) {
        console.error('Error deleting prompt:', err);
        setError('Failed to delete prompt');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setTitle(prompt.title);
    setContent(prompt.content);
    setDescription(prompt.description || '');
    setTags(prompt.tags.join(', '));
    setIsPublic(prompt.isPublic);
    setEditingPromptId(prompt.id);
    setShowCreateForm(true);
  };

  const handleUsePrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      // Aqui você pode adicionar uma notificação de sucesso
      console.log('Prompt copiado para a área de transferência');
    } catch (err) {
      console.error('Erro ao copiar prompt:', err);
    }
  };

  return (
    <MainLayout>
      {/* Background decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-600/10 rounded-full blur-3xl animate-float animation-delay-4000"></div>
      </div>

      <div className="relative flex flex-col h-full">
        {/* Header com gradiente */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 animate-glow">
            <FiBookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Biblioteca de Prompts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Crie, gerencie e compartilhe seus prompts favoritos
          </p>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiPlus className="mr-2 w-5 h-5" />
              Novo Prompt
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <FiEdit2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {editingPromptId ? 'Editar Prompt' : 'Criar Novo Prompt'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Preencha os campos abaixo para {editingPromptId ? 'atualizar' : 'criar'} seu prompt</p>
              </div>
            </div>
            <form onSubmit={editingPromptId ? handleUpdatePrompt : handleCreatePrompt}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={5}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="writing, code, research"
                />
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Make this prompt public
                </label>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Salvando...' : editingPromptId ? 'Atualizar Prompt' : 'Criar Prompt'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-8">
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('my-prompts')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'my-prompts' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FiStar className="w-4 h-4 mr-2" />
                  Meus Prompts
                </div>
              </button>
              <button
                onClick={() => setActiveTab('public-prompts')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'public-prompts' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center">
                  <FiEye className="w-4 h-4 mr-2" />
                  Prompts Públicos
                </div>
              </button>
            </nav>
          </div>
        </div>

        {isLoading && !showCreateForm ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTab === 'my-prompts' ? (
              userPrompts.length > 0 ? (
                userPrompts.map((prompt) => (
                  <div key={prompt.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                          <FiBookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{prompt.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{prompt.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditPrompt(prompt)}
                          className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        Usado {prompt.usageCount} vezes
                      </div>
                      <div className="text-xs flex items-center">
                        {prompt.isPublic ? (
                          <span className="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                            <FiEye className="w-3 h-3 mr-1" /> Público
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            <FiEyeOff className="w-3 h-3 mr-1" /> Privado
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-300 text-xs px-3 py-1 rounded-full border border-purple-200 dark:border-purple-700">
                          <FiTag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  You don't have any prompts yet. Create one to get started!
                </div>
              )
            ) : (
              publicPrompts.length > 0 ? (
                publicPrompts.map((prompt) => (
                  <div key={prompt.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6 hover:shadow-2xl transition-all duration-200 transform hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-start">
                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                           <FiEye className="w-5 h-5 text-white" />
                         </div>
                         <div className="flex-1">
                           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{prompt.title}</h3>
                           <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{prompt.description}</p>
                         </div>
                       </div>
                       <div className="flex space-x-2 ml-4">
                         <button
                           onClick={() => handleUsePrompt(prompt)}
                           className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                         >
                           <FiCopy className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                    
                    <div className="flex items-center justify-between mb-4">
                       <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                         Usado {prompt.usageCount} vezes
                       </div>
                       <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                         Público
                       </div>
                     </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-800 dark:text-green-300 text-xs px-3 py-1 rounded-full border border-green-200 dark:border-green-700">
                          <FiTag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No public prompts available.
                </div>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default PromptsPage;
