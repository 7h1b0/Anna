import React from 'react';
import { useHistory } from 'react-router-dom';

const Title: React.FC<{ title: string; activateNavigation?: boolean }> = ({
  title,
  activateNavigation = false,
}) => {
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };
  return (
    <div className="relative my-5 text-center">
      {activateNavigation && (
        <button
          onClick={handleCancel}
          aria-label="back"
          className="left-0 absolute"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="text-white fill-current w-6"
          >
            <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
          </svg>
        </button>
      )}
      <h1 className="text-2xl text-white tracking-wide leading-none">
        {title}
      </h1>
    </div>
  );
};

export default Title;
