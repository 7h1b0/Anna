import React from 'react';

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

type Props = {
  name: string;
  label: string;
  register: RefReturn;
  placeholder?: string;
};

function Checkbox({ name, label, placeholder = '', register }: Props) {
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
        {...register}
        placeholder={placeholder}
        className="ml-2 text-base bg-gray-800 text-gray-400 rounded leading-tight focus:outline-none focus:bg-gray-700"
      />
    </div>
  );
}

export default Checkbox;
