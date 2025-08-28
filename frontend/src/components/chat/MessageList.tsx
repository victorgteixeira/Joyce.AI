import React, { useRef, useEffect } from 'react';
import { FiCpu, FiZap } from 'react-icons/fi';
import Message from './Message';
import type { Message as MessageType } from '../../services/conversation.service';

interface MessageListProps {
  messages: MessageType[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 overflow-y-auto py-6 px-3 sm:py-10 sm:px-4">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👋</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Como posso ajudar você hoje?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-sm sm:max-w-md px-2">
            Você pode me perguntar qualquer coisa, desde dúvidas simples até tarefas complexas. Estou aqui para ajudar!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <Message
          key={message.id ?? index}
          content={message.content}
          role={message.role}
          timestamp={message.createdAt}
        />
      ))}

      {isLoading && (
        <div className="py-3 sm:py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-indigo-900/20 border-l-4 border-gradient-to-b from-blue-500 to-purple-500">
          <div className="px-3 sm:px-4 flex">
            <div className="flex-shrink-0 mr-3 sm:mr-4">
              <div className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <FiCpu className="text-xs sm:text-sm animate-spin" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-20"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base flex items-center">
                  Joyce.AI
                  <FiZap className="ml-2 w-3 h-3 text-yellow-500 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5 sm:space-x-2">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce"></div>
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium animate-pulse">
                  Pensando...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
