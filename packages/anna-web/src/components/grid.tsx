import React, { type ReactNode } from 'react';

const Grid: React.FC<{
  className?: string;
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">{children}</div>
  );
};

export default Grid;
