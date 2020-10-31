import React from 'react';
import { useHistory } from 'react-router-dom';

type Props = {
  title: string;
  subtitle?: string | React.ReactNode;
  activateNavigation?: boolean;
  action?: React.ReactNode;
};

const Title: React.FC<Props> = ({
  title,
  subtitle,
  activateNavigation = false,
  action,
}) => {
  const history = useHistory();

  function handleBack() {
    history.goBack();
  }

  return (
    <header className="flex my-5 items-center">
      {activateNavigation && (
        <button onClick={handleBack} aria-label="back" className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="text-white fill-current w-6"
          >
            <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
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
};

export default Title;
