import React from 'react';
import { Link } from 'react-router-dom';

import Title from 'src/components/title';
import Typography from 'src/components/typography';

import { useUser } from 'context/user-context';

function Settings() {
  const user = useUser();

  return (
    <>
      <Title title="Settings" />
      <div className="flex bg-gray-800 rounded p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="fill-current text-teal-500 w-8 mx-auto"
        >
          <path d="M5 5a5 5 0 0 1 10 0v2A5 5 0 0 1 5 7V5zM0 16.68A19.9 19.9 0 0 1 10 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
        </svg>
        <div className="text-white flex-1 ml-2">
          <Typography variant="heading" className="capitalize">
            {user ? user.username : ''}
          </Typography>
          <Link to="/logout">
            <Typography>Logout</Typography>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Settings;
