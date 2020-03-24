import React from 'react';

import Title from 'src/components/title';
import Room from 'components/room';

import { useDataStoreGetAll } from 'context/db-context';
import { Room as RoomType } from 'types/room';

const Routines: React.FC<{}> = () => {
  const rooms = useDataStoreGetAll<RoomType>('rooms');

  if (rooms === null) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Title title="Rooms" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
        {rooms.map((el) => (
          <Room key={el.roomId} room={el} />
        ))}
      </div>
    </>
  );
};

export default Routines;
