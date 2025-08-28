import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiPlus, FiMessageSquare, FiBookmark, FiSettings, FiLogOut, FiX, FiClock, FiStar } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { useNotification } from '../../contexts/NotificationContext';
import ConversationService from '../../services/conversation.service';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile = false, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { showNotification } = useNotification();
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) {
        return;
      }
      
      try {
        const userConversations = await ConversationService.getUserConversations();
        
        // Pega apenas as 10 conversas mais recentes
        const recentConversations = userConversations
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 10)
          .map(conv => ({ id: conv.id, title: conv.title }));
        
        setConversations(recentConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      }
    };

    fetchConversations();
  }, [user]);

  const handleLogout = () => {
    try {
      logout();
      showNotification('success', 'Logout realizado com sucesso');
    } catch (error) {
      console.error('Logout failed:', error);
      showNotification('error', 'Falha ao realizar logout');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-64 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      {/* Logo and new chat button */}
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <FiStar className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Joyce.AI
            </h1>
          </div>
          {mobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
        <Link
          to="/chat/new"
          className="flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={mobile ? onClose : undefined}
        >
          <FiPlus className="mr-2 w-4 h-4" />
          Nova Conversa
        </Link>
      </div>

      {/* Recent conversations */}
      <div className="relative flex-1 overflow-y-auto py-2 px-4">
        <div className="flex items-center space-x-2 mb-4">
          <FiClock className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Conversas Recentes
          </h2>
        </div>
        <div className="space-y-2">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/chat/${conversation.id}`}
                className={`flex items-center py-3 px-3 rounded-xl transition-all duration-200 group ${
                  isActive(`/chat/${conversation.id}`) 
                    ? 'bg-gradient-to-r from-purple-600/50 to-pink-600/50 backdrop-blur-xl border border-purple-500/30' 
                    : 'hover:bg-white/10 backdrop-blur-xl'
                }`}
                onClick={mobile ? onClose : undefined}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
                  isActive(`/chat/${conversation.id}`)
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                    : 'bg-gray-700 group-hover:bg-gray-600'
                }`}>
                  <FiMessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="truncate text-sm text-gray-200 group-hover:text-white transition-colors duration-200">
                  {conversation.title}
                </span>
              </Link>
            ))
          ) : (
            <div className="text-sm text-gray-400 py-4 px-3 text-center bg-gray-800/50 rounded-xl backdrop-blur-xl">
              Nenhuma conversa recente
            </div>
          )}
        </div>
      </div>

      {/* Navigation links */}
      <div className="relative p-4 border-t border-gray-700/50">
        <nav className="space-y-2">
          <Link
            to="/prompts"
            className={`flex items-center py-3 px-3 rounded-xl transition-all duration-200 group ${
              isActive('/prompts') 
                ? 'bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-xl border border-blue-500/30' 
                : 'hover:bg-white/10 backdrop-blur-xl'
            }`}
            onClick={mobile ? onClose : undefined}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
              isActive('/prompts')
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gray-700 group-hover:bg-gray-600'
            }`}>
              <FiBookmark className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">
              Biblioteca de Prompts
            </span>
          </Link>
          
          <Link
            to="/settings"
            className={`flex items-center py-3 px-3 rounded-xl transition-all duration-200 group ${
              isActive('/settings') 
                ? 'bg-gradient-to-r from-green-600/50 to-blue-600/50 backdrop-blur-xl border border-green-500/30' 
                : 'hover:bg-white/10 backdrop-blur-xl'
            }`}
            onClick={mobile ? onClose : undefined}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 ${
              isActive('/settings')
                ? 'bg-gradient-to-br from-green-500 to-blue-600'
                : 'bg-gray-700 group-hover:bg-gray-600'
            }`}>
              <FiSettings className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">
              Configurações
            </span>
          </Link>
          
          <div className="flex items-center justify-between py-3 px-3 bg-gray-800/50 rounded-xl backdrop-blur-xl">
            <span className="text-sm text-gray-300">Tema</span>
            <ThemeToggle />
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left py-3 px-3 rounded-xl hover:bg-red-600/20 transition-all duration-200 group backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 bg-gray-700 group-hover:bg-red-600">
              <FiLogOut className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-gray-200 group-hover:text-white transition-colors duration-200">
              Sair
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;