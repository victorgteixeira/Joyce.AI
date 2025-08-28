import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import PromptService from '../../services/prompt.service';
import type { Prompt } from '../../services/prompt.service';

interface PromptSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: Prompt) => void;
  prompts?: Prompt[];
}

const PromptSidebar: React.FC<PromptSidebarProps> = ({ isOpen, onClose, onSelectPrompt, prompts: externalPrompts }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (externalPrompts && externalPrompts.length > 0) {
        setPrompts(externalPrompts);
        setFilteredPrompts(externalPrompts);
        setIsLoading(false);
        setError(null);
      } else {
        fetchPrompts();
      }
    }
  }, [isOpen, externalPrompts]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPrompts(prompts);
    } else {
      const q = searchTerm.toLowerCase();
      const filtered = prompts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q))
      );
      setFilteredPrompts(filtered);
    }
  }, [searchTerm, prompts]);

  const fetchPrompts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Carrega prompts do usuário e públicos separadamente
      const [userPromptsResult, publicPromptsResult] = await Promise.allSettled([
        PromptService.getUserPrompts(),
        PromptService.getPublicPrompts(),
      ]);

      const userPrompts = userPromptsResult.status === 'fulfilled' ? userPromptsResult.value : [];
      const publicPrompts = publicPromptsResult.status === 'fulfilled' ? publicPromptsResult.value : [];

      if (userPromptsResult.status === 'rejected') {
        console.error('Error fetching user prompts:', userPromptsResult.reason);
      }
      if (publicPromptsResult.status === 'rejected') {
        console.error('Error fetching public prompts:', publicPromptsResult.reason);
      }

      // Combina evitando duplicados
      const all = [...userPrompts];
      for (const pub of publicPrompts) {
        if (!all.some((p) => p.id === pub.id)) all.push(pub);
      }

      setPrompts(all);
      setFilteredPrompts(all);
      
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

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
              <div className="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Prompt Library</h2>
                  <button
                    onClick={onClose}
                    className="ml-3 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Close panel</span>
                    <FiX className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search prompts..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  </div>
                ) : error ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                ) : filteredPrompts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleSelectPrompt(prompt)}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{prompt.title}</h3>
                        {prompt.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{prompt.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {prompt.tags.map((tag, i) => (
                            <span key={i} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No prompts found. Try a different search or create new prompts in the Prompt Library.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptSidebar;
