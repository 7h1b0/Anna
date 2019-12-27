import React from 'react';

const Alert: React.FC<{}> = ({ children }) => {
  return (
    <div className="bg-red-500 rounded text-white px-4 py-3 my-4" role="alert">
      {children}
    </div>
  );
};

export default Alert;
