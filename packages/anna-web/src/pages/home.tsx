import React from 'react';

import Title from 'components/title';
import Typography from 'components/typography';
import Scene from 'components/scene';
import Room from 'components/room';

import { useDataStoreGetAll } from 'context/db-context';

import { Scene as SceneType } from 'types/scene';
import { Room as RoomType } from 'types/room';

const Scenes: React.FC<{}> = () => {
  const scenes = useDataStoreGetAll<SceneType>('scenes');
  const rooms = useDataStoreGetAll<RoomType>('rooms');

  if (scenes === null || rooms === null) {
    return <p>Loading</p>;
  }
  return (
    <>
      <Title title="Home" />
      <Typography className="mt-4 mb-2" variant="heading">
        Rooms
      </Typography>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        {rooms
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((el) => (
            <Room key={el.roomId} room={el} />
          ))}
      </div>
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
