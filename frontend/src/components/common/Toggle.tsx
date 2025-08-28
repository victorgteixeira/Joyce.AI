import React from 'react';
import { Switch } from '@headlessui/react';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: {
      switch: 'h-4 w-7',
      dot: 'h-3 w-3',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'h-5 w-10',
      dot: 'h-4 w-4',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'h-6 w-12',
      dot: 'h-5 w-5',
      translate: 'translate-x-6',
    },
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Switch
        checked={enabled}
        onChange={disabled ? () => {} : onChange}
        className={`
          ${enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          relative inline-flex shrink-0 border-2 border-transparent rounded-full
          transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2
          focus:ring-offset-2 focus:ring-primary-500
          ${sizeClasses[size].switch}
        `}
        disabled={disabled}
      >
        <span
          aria-hidden="true"
          className={`
            ${enabled ? sizeClasses[size].translate : 'translate-x-0'}
            pointer-events-none inline-block rounded-full bg-white shadow-lg
            transform ring-0 transition ease-in-out duration-200
            ${sizeClasses[size].dot}
          `}
        />
      </Switch>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Toggle;