import React, { type ReactNode } from 'react';

const Card: React.FC<{
  role?: string;
  onClick?: () => void;
  className?: string;
  tabIndex?: number;
  children: ReactNode;
  backgroundColor?: string;
}> = ({ children, role, onClick, className, tabIndex, backgroundColor }) => {
  return (
    <div
      role={role}
      onClick={onClick}
      onKeyPress={onClick}
      tabIndex={tabIndex}
      style={{ backgroundColor }}
      className={`text-gray-200 shadow-md flex rounded bg-gray-800 py-4 px-2 xl:px-4 hover:bg-gray-700 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
