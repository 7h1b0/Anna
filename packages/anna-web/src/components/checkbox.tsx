import React from 'react';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  defaultChecked?: boolean;
};

function Checkbox({
  name,
  label,
  placeholder = '',
  defaultChecked = false,
}: Props) {
  return (
    <div className="flex items-center">
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
        placeholder={placeholder}
        defaultChecked={defaultChecked}
        className="ml-2 text-base bg-gray-800 text-gray-400 rounded leading-tight focus:outline-none focus:bg-gray-700"
      />
    </div>
  );
}

export default Checkbox;
