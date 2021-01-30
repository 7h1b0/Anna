import React from 'react';

type Props = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
};

function Checkbox({
  name,
  label,
  checked,
  onChange,
  required = false,
  placeholder = '',
}: Props) {
  return (
    <div className="flex items-center py-4">
      <label
        htmlFor={name}
        className="text-gray-400 text-xs font-bold uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="ml-2 text-base bg-gray-800 text-gray-400 rounded leading-tight focus:outline-none focus:bg-gray-700"
      />
    </div>
  );
}

export default Checkbox;
