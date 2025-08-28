import { type ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black bg-opacity-50 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      />

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white dark:bg-gray-800 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar mobile onClose={toggleSidebar} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <MobileNav onMenuClick={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="h-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;