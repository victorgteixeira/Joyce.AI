import { FiMenu } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

interface MobileNavProps {
  onMenuClick: () => void;
}

const MobileNav = ({ onMenuClick }: MobileNavProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm md:hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <div className="text-lg font-semibold text-gray-900 dark:text-white">Joyce.AI</div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileNav;