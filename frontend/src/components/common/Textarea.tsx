import React, { type TextareaHTMLAttributes, forwardRef } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
  maxRows?: number;
  autoResize?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((
  { 
    label, 
    error, 
    fullWidth = true,
    rows = 3,
    maxRows,
    autoResize = false,
    className = '',
    onChange,
    ...rest 
  }, 
  ref
) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  
  React.useImperativeHandle(ref, () => textareaRef.current!);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
    
    if (autoResize) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      
      let newHeight = textarea.scrollHeight;
      
      if (maxRows) {
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
        const maxHeight = lineHeight * maxRows;
        newHeight = Math.min(newHeight, maxHeight);
      }
      
      textarea.style.height = `${newHeight}px`;
    }
  };

  const textareaClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-primary-500 focus:border-primary-500 
    ${error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500 dark:border-red-600 dark:text-red-400' : 'border-gray-300 dark:border-gray-600'} 
    ${fullWidth ? 'w-full' : ''}
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
        <textarea 
          ref={textareaRef}
          className={textareaClasses} 
          rows={rows}
          onChange={handleChange}
          {...rest} 
        />
        
        {error && (
          <div className="absolute top-2 right-2 flex items-center pointer-events-none">
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

Textarea.displayName = 'Textarea';

export default Textarea;