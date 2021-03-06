import React from 'react';

const Card: React.FC<{
  role?: string;
  onClick?: () => void;
  className?: string;
}> = ({ children, role, onClick, className }) => {
  return (
    <div
      role={role}
      onClick={onClick}
      onKeyPress={onClick}
      className={`text-gray-200 shadow-md flex rounded bg-gray-800 py-4 px-2 xl:px-4 hover:bg-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
