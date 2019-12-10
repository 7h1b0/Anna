import React from 'react';

const Card: React.FC<{
  role?: 'button';
  onClick?: () => void;
}> = ({ children, role, onClick }) => {
  return (
    <div
      role={role}
      onClick={onClick}
      className="rounded bg-gray-800 p-2 xl:p-4"
    >
      {children}
    </div>
  );
};

export default Card;
