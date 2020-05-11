import React from 'react';

import Title from 'components/title';
import Typography from 'components/typography';
import Scene from 'components/scene';
import Room from 'components/room';
import Grid from 'components/grid';
import Loader from 'components/loader';

import { useDataStoreGetAll } from 'context/db-context';

import type { Scene as SceneType } from 'types/scene';
import type { Room as RoomType } from 'types/room';

const Scenes: React.FC<{}> = () => {
  const scenes = useDataStoreGetAll<SceneType>('scenes');
  const rooms = useDataStoreGetAll<RoomType>('rooms');

  if (scenes === null || rooms === null) {
    return <Loader />;
  }
  return (
    <>
      <Title title="Home" />
      <Typography className="mt-4 mb-2" variant="heading">
        Rooms
      </Typography>
      <Grid>
        {rooms
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((el) => (
            <Room key={el.roomId} room={el} />
          ))}
      </Grid>
      <Typography className="mt-4 mb-2" variant="heading">
        Scenes
      </Typography>
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
        {scenes
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ name, sceneId }) => (
            <Scene key={sceneId} sceneId={sceneId} name={name} />
          ))}
      </div>
    </>
  );
};

export default Scenes;
