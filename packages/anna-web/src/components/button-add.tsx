import React from 'react';
import { Link } from 'react-router-dom';

const FloatingButton: React.FC<{
  to: string;
}> = ({ to }) => {
  return (
    <Link
      to={to}
      className="bg-teal-500 rounded-full text-white absolute bottom-0 right-0 m-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="p-2 w-10"
      >
        <path
          fillRule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
};

export default FloatingButton;
