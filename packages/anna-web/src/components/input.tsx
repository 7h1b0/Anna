import React from 'react';

interface Props extends Partial<HTMLInputElement> {
  name: string;
  label: string;
  hasError?: boolean;
}

function Input({
  name,
  label,
  type = 'text',
  placeholder = '',
  disabled = false,
  hasError = false,
  ...rest
}: Props) {
  return (
    <label htmlFor={name} className="text-gray-400 text-xs font-bold uppercase">
      {label}
      <input
        {...rest}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`text-base block w-full bg-gray-800 text-gray-200 rounded py-3 px-4 mt-1 leading-tight focus:outline-none focus:bg-gray-700 ${
          hasError ? 'ring-red-400 ring-1' : 'focus:ring-1 focus:ring-teal-500'
        }`}
      />
    </label>
  );
}

export default Input;
