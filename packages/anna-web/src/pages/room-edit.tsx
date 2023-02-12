import React from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Title from 'src/components/title';
import RoomForm from 'components/room-form';

import type { Room as RoomType } from 'types/room';

function RoomEdit() {
  const room = useRouteLoaderData('room') as RoomType;

  return (
    <>
      <Title title="Edit room" activateNavigation />
      <RoomForm room={room} />
    </>
  );
}

export default RoomEdit;
