import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      {/* Mobile sidebar */}
      {showSidebar && (
        <div 
          className={`
            fixed inset-0 z-40 flex md:hidden
            ${isSidebarOpen ? 'visible' : 'invisible'}
          `}
          aria-hidden="true"
        >
          {/* Sidebar backdrop */}
          <div 
            className={`
              fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300
              ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}
            `}
            aria-hidden="true"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className={`
              relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 transition ease-in-out duration-300 transform
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
          
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {showSidebar && (
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {showSidebar && <MobileNav onMenuClick={toggleSidebar} />}
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;