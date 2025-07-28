// src/components/ui/Button.jsx
import React from 'react';

/**
 * A reusable Button component.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to display inside the button (e.g., text, icons).
 * @param {'primary' | 'secondary' | 'success' | 'outline-yellow' | 'dark'} [props.variant='primary'] - Defines the button's visual style.
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Defines the button's size.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the button.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled.
 * @param {React.MouseEventHandler<HTMLButtonElement>} [props.onClick] - Click event handler.
 * @param {string} [props.type='button'] - The type of the button (e.g., 'button', 'submit', 'reset').
 * @param {object} [props.rest] - Any other standard button attributes (e.g., id, aria-label).
 */
export const Button = ({
  children,
  variant = 'primary', // Default variant
  size = 'md',         // Default size
  className = '',      // Allows custom classes to be passed
  disabled = false,
  onClick,
  type = 'button',
  ...rest // Captures any other props like id, aria-label etc.
}) => {
  // Base styles applied to all buttons
  let baseStyles = "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Styles based on the 'variant' prop
  let variantStyles = "";
  switch (variant) {
    case 'primary':
      variantStyles = "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500";
      break;
    case 'secondary':
      variantStyles = "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400";
      break;
    case 'success': // Used for "Register as Employer" from your earlier code
      variantStyles = "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500";
      break;
    case 'outline-yellow': // Used for "Register as Employer" in the professional layout
      // Note: Assumes a dark background for this variant to look good
      variantStyles = "border border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-blue-900 focus:ring-yellow-300";
      break;
    case 'dark': // A general purpose dark button, useful on light backgrounds
      variantStyles = "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-700";
      break;
    // Add more cases for other variants as needed (e.g., 'danger', 'info')
    default:
      variantStyles = "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"; // Fallback to primary
  }

  // Styles based on the 'size' prop
  let sizeStyles = "";
  switch (size) {
    case 'sm':
      sizeStyles = "px-3 py-1.5 text-sm";
      break;
    case 'md':
      sizeStyles = "px-4 py-2 text-base";
      break;
    case 'lg':
      sizeStyles = "px-6 py-3 text-lg";
      break;
    // Add more cases for other sizes as needed
    default:
      sizeStyles = "px-4 py-2 text-base"; // Fallback to medium
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...rest} // Spread any additional props
    >
      {children}
    </button>
  );
};