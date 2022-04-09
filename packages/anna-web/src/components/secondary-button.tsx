import React, { type ReactNode } from 'react';

const SecondaryButton: React.FC<{
  type?: 'button' | 'reset' | 'submit';
  onClick?: () => void;
  children: ReactNode;
}> = ({ children, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="text-white mt-4 border-2 border-teal-800 px-8 bg-transparent hover:border-teal-700 text-sm py-2 rounded"
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
