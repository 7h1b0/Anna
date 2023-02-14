import React from 'react';

type Options = {
  label: string;
  value: string;
};
type Props = {
  autofocus?: boolean;
  name: string;
  label: string;
  options: Options[];
  defaultValue?: string;
};

function Select({ name, label, options, defaultValue }: Props) {
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
        name={name}
        defaultValue={defaultValue}
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
