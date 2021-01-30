import React from 'react';
import { Link } from 'react-router-dom';

function ButtonAdd({ to }: { to: string }) {
  return (
    <Link to={to} className="text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </Link>
  );
}

export default ButtonAdd;
