import React from 'react';
import { Link } from 'react-router-dom';

import Title from 'src/components/title';
import Button from 'src/components/button';
import Typographie from 'src/components/typographie';
import Card from 'src/components/card';

import { saveConfig } from 'modules/database';
import { useDatabase } from 'context/db-context';
import { useUser } from 'context/user-context';

const Settings: React.FC<{}> = () => {
  const database = useDatabase();
  const user = useUser();

  const handleRefresh = async () => {
    const config = await fetch('/api', {
      headers: {
        'x-access-token': user && user.token ? user.token : '',
      },
    }).then((res) => res.json());

    saveConfig(database, config);
  };

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
          <Typographie variant="heading" className="capitalize">
            {user ? user.username : ''}
          </Typographie>
          <Link to="/logout">
            <Typographie>Logout</Typographie>
          </Link>
        </div>
      </div>
      <Card>
        <Typographie variant="body" className="capitalize">
          Refresh data
        </Typographie>
        <Button onClick={handleRefresh}>Refresh</Button>
      </Card>
    </>
  );
};

export default Settings;
