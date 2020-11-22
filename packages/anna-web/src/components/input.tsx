import React from 'react';

type Props = {
  autofocus?: boolean;
  name: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  disabled = false,
}) => {
  return (
    <label htmlFor={name} className="text-gray-400 text-xs font-bold uppercase">
      {label}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="text-base block w-full bg-gray-800 text-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-700"
      />
    </label>
  );
};

export default Input;
