import React from 'react';

/**
 * دکمه لمسی بزرگ با حداقل ارتفاع ۵۲px
 * @param {object} props
 * @param {'primary'|'success'|'danger'|'outline'} props.variant
 * @param {string} props.icon - ایموجی یا آیکن
 * @param {React.ReactNode} props.children
 * @param {boolean} props.fullWidth
 * @param {boolean} props.disabled
 * @param {function} props.onClick
 */
export default function Button({
  variant = 'primary',
  icon,
  children,
  fullWidth = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const base = 'btn-touch select-none font-bold';

  const variants = {
    primary: 'bg-blue-700 text-white shadow-md active:bg-blue-800',
    success: 'bg-green-600 text-white shadow-md active:bg-green-700',
    danger: 'bg-red-600 text-white shadow-md active:bg-red-700',
    outline: 'border-2 border-gray-300 bg-white text-gray-800 active:bg-gray-100',
  };

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
      {...rest}
    >
      {icon && <span className="mr-2 text-xl">{icon}</span>}
      {children}
    </button>
  );
}