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
      className={`text-gray-200 flex justify-between items-center rounded bg-gray-800 p-4 hover:bg-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
