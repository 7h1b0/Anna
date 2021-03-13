import React from 'react';
import { RefCallbackHandler } from 'react-hook-form';

type Props = {
  autofocus?: boolean;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  register: RefCallbackHandler;
  hasError?: boolean;
};

function Input({
  name,
  label,
  type = 'text',
  placeholder = '',
  disabled = false,
  hasError = false,
  register,
}: Props) {
  return (
    <label htmlFor={name} className="text-gray-400 text-xs font-bold uppercase">
      {label}
      <input
        {...register}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`text-base block w-full bg-gray-800 text-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-700 ${
          hasError ? 'ring-red-400 ring-1' : 'focus:ring-1 focus:ring-teal-500'
        }`}
      />
    </label>
  );
}

export default Input;
