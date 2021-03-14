import React from 'react';
import { RefCallbackHandler } from 'react-hook-form';

type Props = {
  name: string;
  label: string;
  register: RefCallbackHandler;
  placeholder?: string;
};

function Checkbox({ name, label, placeholder = '', register }: Props) {
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
        type="checkbox"
        {...register}
        placeholder={placeholder}
        className="ml-2 text-base bg-gray-800 text-gray-400 rounded leading-tight focus:outline-none focus:bg-gray-700"
      />
    </div>
  );
}

export default Checkbox;
