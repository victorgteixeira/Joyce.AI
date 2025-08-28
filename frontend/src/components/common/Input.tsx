import React, { type InputHTMLAttributes, forwardRef } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  { 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = true,
    className = '',
    ...rest 
  }, 
  ref
) => {
  const inputClasses = `
    block px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-primary-500 focus:border-primary-500 
    ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 dark:border-red-600 dark:text-red-400' : 'border-gray-300 dark:border-gray-600'} 
    ${fullWidth ? 'w-full' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
    ${className}
  `;

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input ref={ref} className={inputClasses} {...rest} />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400">{rightIcon}</span>
          </div>
        )}
        
        {error && !rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;