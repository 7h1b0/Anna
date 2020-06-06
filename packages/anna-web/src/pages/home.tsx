import React from 'react';

import Typography from 'components/typography';
import Scene from 'components/scene';
import Room from 'components/room';
import Grid from 'components/grid';
import Loader from 'components/loader';
import { Link } from 'react-router-dom';
import { SettingsIcon } from 'components/icons';

import { useDataStoreGetAll } from 'context/db-context';

import type { Scene as SceneType } from 'types/scene';
import type { Room as RoomType } from 'types/room';

function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

const Scenes: React.FC<{}> = () => {
  const scenes = useDataStoreGetAll<SceneType>('scenes');
  const rooms = useDataStoreGetAll<RoomType>('rooms');

  if (scenes === null || rooms === null) {
    return <Loader />;
  }
  return (
    <>
      <header className="flex justify-between items-center py-4">
        <div>
          <p className="text-base text-xl uppercase text-teal-500">
            Welcome Home
          </p>
        </div>
        <Link to="/settings" className="fill-current text-white">
          <SettingsIcon className="w-5" />
        </Link>
      </header>
      <Typography className="mt-4 mb-2" variant="heading">
        Rooms
      </Typography>
      <Grid>
        {rooms.sort(sortByName).map((el) => (
          <Room key={el.roomId} room={el} />
        ))}
      </Grid>
      <Typography className="mt-4 mb-2" variant="heading">
        Scenes
      </Typography>
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
        {scenes.sort(sortByName).map(({ name, sceneId }) => (
          <Scene key={sceneId} sceneId={sceneId} name={name} />
        ))}
      </div>
    </>
  );
};

export default Scenes;
