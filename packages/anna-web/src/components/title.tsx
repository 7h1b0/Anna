import React from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  title: string;
  subtitle?: string | React.ReactNode;
  activateNavigation?: boolean;
  action?: React.ReactNode;
};

function Title({ title, subtitle, activateNavigation = false, action }: Props) {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  return (
    <header className="flex my-6 items-center">
      {activateNavigation && (
        <button onClick={handleBack} aria-label="back" className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-white fill-current w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      )}
      <div className="flex-grow">
        <h1 className="text-xl text-white tracking-wide leading-none">
          {title}
        </h1>
        <p className="text-sm text-white">{subtitle}</p>
      </div>
      {action ? action : null}
    </header>
  );
}

export default Title;
