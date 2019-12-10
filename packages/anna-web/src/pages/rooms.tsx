import React from 'react';

import Header from 'components/header';
import Room from 'components/room';

import useFetch from 'src/hooks/use-fetch';
import { Room as RoomType } from 'types/room';

const Routines: React.FC<{}> = () => {
  const rooms = useFetch<RoomType>('/api/rooms');

  return (
    <>
      <Header title="Rooms" />
      {rooms.map(el => (
        <Room key={el.roomId} room={el} />
      ))}
    </>
  );
};

export default Routines;
