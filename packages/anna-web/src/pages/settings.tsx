import React from 'react';
import { Link } from 'react-router-dom';

import Title from 'src/components/title';
import { ArrowIcon } from 'src/components/icons';
import Card from 'src/components/card';
import Typography from 'src/components/typography';

function Settings() {
  return (
    <>
      <Title title="Settings" />
      <div className="flex gap-4 flex-col">
        <Link to={`/home/rooms/add`}>
          <Card className="justify-between items-center">
            <Typography>Add a room</Typography>
            <ArrowIcon className="fill-current h-4 w-4" />
          </Card>
        </Link>

        <Link to={`/home/dios/add`}>
          <Card className="justify-between items-center">
            <Typography>Add a dio device</Typography>
            <ArrowIcon className="fill-current h-4 w-4" />
          </Card>
        </Link>

        <Link to={`/home/lights/add`}>
          <Card className="justify-between items-center">
            <Typography>Add a hue-light to a room</Typography>
            <ArrowIcon className="fill-current h-4 w-4" />
          </Card>
        </Link>
      </div>

      <div className="text-center py-2 my-2">
        <Link to="/logout">
          <Typography>Logout</Typography>
        </Link>
      </div>
    </>
  );
}

export default Settings;
