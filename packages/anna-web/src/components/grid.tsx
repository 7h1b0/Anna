import React from 'react';

const Grid: React.FC<{
  className?: string;
}> = ({ children }) => {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">{children}</div>
  );
};

export default Grid;
