import React from 'react';

const CardVertical: React.FC<{
  role?: string;
  onClick?: () => void;
}> = ({ children, role, onClick }) => {
  return (
    <div
      role={role}
      onClick={onClick}
      className="text-gray-200 flex flex-col justify-center items-center rounded bg-gray-800 p-4 hover:bg-gray-700 text-center"
    >
      {children}
    </div>
  );
};

export default CardVertical;
