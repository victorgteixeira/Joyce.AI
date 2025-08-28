import React from 'react';
import { Tab } from '@headlessui/react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultIndex = 0,
  onChange,
  className = '',
  variant = 'default',
}) => {
  const variantClasses = {
    default: {
      list: 'flex space-x-1 border-b border-gray-200 dark:border-gray-700',
      tab: 'py-2.5 px-4 text-sm font-medium leading-5 focus:outline-none',
      selected: 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400',
      notSelected: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
    },
    pills: {
      list: 'flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl',
      tab: 'py-2 px-4 text-sm font-medium leading-5 rounded-lg focus:outline-none',
      selected: 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow',
      notSelected: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
    },
    underline: {
      list: 'flex space-x-8 border-b border-gray-200 dark:border-gray-700',
      tab: 'py-4 px-1 text-sm font-medium leading-5 focus:outline-none whitespace-nowrap',
      selected: 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400',
      notSelected: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
    },
  };

  return (
    <div className={className}>
      <Tab.Group defaultIndex={defaultIndex} onChange={onChange}>
        <Tab.List className={variantClasses[variant].list}>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              disabled={tab.disabled}
              className={({ selected }) => `
                ${variantClasses[variant].tab}
                ${selected 
                  ? variantClasses[variant].selected 
                  : variantClasses[variant].notSelected}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center">
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, index) => (
            <Tab.Panel key={index}>
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;