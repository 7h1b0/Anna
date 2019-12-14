import React from 'react';

const Button: React.FC<{
  type?: 'button' | 'reset' | 'submit';
  onClick?: () => void;
}> = ({ children, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="text-white mt-4 border-transparent w-full border-4 bg-teal-500 hover:bg-teal-700 text-sm px-2 py-1 rounded-full"
    >
      {children}
    </button>
  );
};

export default Button;
