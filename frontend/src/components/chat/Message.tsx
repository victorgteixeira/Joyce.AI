import React from 'react';
import { FiUser, FiCpu, FiInfo } from 'react-icons/fi';

export type ChatRole = 'user' | 'assistant' | 'system';

interface MessageProps {
  content: string;
  role: ChatRole;
  timestamp?: string;
}

const Message: React.FC<MessageProps> = ({ content, role, timestamp }) => {
  const formatTimestamp = (ts?: string) => {
    if (!ts) return '';
    const date = new Date(ts);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Render especial para mensagens de sistema
  if (role === 'system') {
    return (
      <div className="py-2 px-3 sm:px-4 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FiInfo className="shrink-0" />
          <span className="whitespace-pre-wrap">{content}</span>
          {timestamp && (
            <span className="ml-auto text-xs text-gray-500">{formatTimestamp(timestamp)}</span>
          )}
        </div>
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div className={`py-3 sm:py-4 ${!isUser ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
      <div className="px-3 sm:px-4 flex">
        <div className="flex-shrink-0 mr-3 sm:mr-4">
          {isUser ? (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <FiUser className="text-sm sm:text-base" />
            </div>
          ) : (
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              <FiCpu className="text-sm sm:text-base" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-1">
            <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
              {isUser ? 'Você' : 'Joyce.AI'}
            </div>
            {timestamp && (
              <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(timestamp)}
              </div>
            )}
          </div>

          {/* Mantém quebras de linha do conteúdo sem precisar dividir string */}
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm sm:text-base text-white">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
