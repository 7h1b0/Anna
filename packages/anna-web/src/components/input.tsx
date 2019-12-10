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
};

const Input: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
}) => {
  return (
    <label htmlFor={name} className="text-gray-400">
      {label}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="appearance-none block w-full bg-gray-800 text-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-gray-700"
      />
    </label>
  );
};

export default Input;
