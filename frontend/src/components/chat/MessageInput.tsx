import React, { useState, type FormEvent, type KeyboardEvent } from 'react';
import { FiSend, FiLoader } from 'react-icons/fi';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading = false,
  placeholder = 'Type a message...'
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`border-t transition-all duration-300 py-3 px-3 sm:py-4 sm:px-4 ${
      isLoading 
        ? 'border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
    }`}>
      <div className="w-full">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            className={`w-full p-2 pr-10 sm:p-3 sm:pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none dark:text-white text-sm sm:text-base transition-all duration-200 ${
              isLoading
                ? 'border-blue-300 dark:border-blue-600 bg-blue-50/50 dark:bg-gray-800/80 focus:ring-blue-400 placeholder-blue-400 dark:placeholder-blue-300'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500'
            }`}
            placeholder={isLoading ? 'Joyce.AI está processando sua mensagem...' : placeholder}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            style={{ minHeight: '50px', maxHeight: '200px' }}
          />
          <button
            type="submit"
            className={`absolute right-2 bottom-2 sm:right-3 sm:bottom-3 p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
              isLoading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-not-allowed'
                : !message.trim()
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 dark:text-blue-400 hover:scale-105 shadow-lg'
            }`}
            disabled={!message.trim() || isLoading}
          >
            {isLoading ? (
              <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </form>
        <div className="mt-1 sm:mt-2 text-xs text-center transition-all duration-200">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="font-medium">Joyce.AI está pensando...</span>
            </div>
          ) : (
            <span className="hidden sm:inline text-gray-500 dark:text-gray-400">Pressione Enter para enviar, Shift+Enter para nova linha</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;