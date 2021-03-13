import React from 'react';
import { RefCallbackHandler } from 'react-hook-form';

type Options = {
  label: string;
  value: string;
};
type Props = {
  autofocus?: boolean;
  name: string;
  label: string;
  register: RefCallbackHandler;
  options: Options[];
};

function Select({ name, label, register, options }: Props) {
  return (
    <div>
      <label
        className="text-gray-400 text-xs font-bold uppercase"
        htmlFor={name}
      >
        {label}
      </label>
      <select
        id={name}
        {...register}
        className="block w-full bg-gray-800 text-gray-400 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-gray-700"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
