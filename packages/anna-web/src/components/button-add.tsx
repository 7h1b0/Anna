import React from 'react';
import { Link } from 'react-router-dom';

const FloatingButton: React.FC<{
  to: string;
}> = ({ to }) => {
  return (
    <Link
      to={to}
      className="text-teal-500 w-10 h-10 absolute bottom-0 right-0 m-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="fill-current"
      >
        <path d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
      </svg>
    </Link>
  );
};

export default FloatingButton;
