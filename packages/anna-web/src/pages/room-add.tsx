import React from 'react';

import Title from 'components/title';
import RoomForm from 'components/room-form';

import type { Room } from 'src/types/room';

function RoomAdd() {
  const room: Room = {
    roomId: '',
    name: '',
    description: '',
    sensors: [],
    devices: {
      dios: [],
      hueLights: [],
    },
  };

  return (
    <>
      <Title title="Add Room" activateNavigation />
      <RoomForm room={room} />
    </>
  );
}

export default RoomAdd;
