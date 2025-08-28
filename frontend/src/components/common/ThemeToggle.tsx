import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useDarkMode } from '../../hooks/useDarkMode';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, effectiveTheme, toggleTheme } = useDarkMode();



  // Função para obter o título do botão
  const getButtonTitle = () => {
    if (theme === 'light') return 'Mudar para tema escuro';
    if (theme === 'dark') return 'Mudar para tema do sistema';
    return 'Mudar para tema claro';
  };

  // Função para obter o ícone correto
  const getIcon = () => {
    if (theme === 'light') return <FiMoon className="w-5 h-5" />;
    if (theme === 'dark') return <FiMonitor className="w-5 h-5" />;
    return <FiSun className="w-5 h-5" />;
  };

  return (
    <button
      onClick={() => toggleTheme()}
      className={`p-2 rounded-md transition-colors ${className} ${
        effectiveTheme === 'dark'
          ? 'text-yellow-300 hover:text-yellow-200 hover:bg-gray-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
      }`}
      aria-label={getButtonTitle()}
      title={getButtonTitle()}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;