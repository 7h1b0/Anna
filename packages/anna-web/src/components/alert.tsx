import React from 'react';

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-500 rounded text-white px-4 py-3 my-4" role="alert">
      {children}
    </div>
  );
}

export default Alert;
