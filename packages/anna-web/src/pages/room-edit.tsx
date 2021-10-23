import React from 'react';
import { useParams } from 'react-router-dom';

import Title from 'src/components/title';
import RoomForm from 'components/room-form';

import useFetch from 'hooks/use-fetch';

import type { Room as RoomType } from 'types/room';

function RoomEdit() {
  const { roomId = '' } = useParams<'roomId'>();
  const room = useFetch<RoomType>(`/api/rooms/${roomId}`);

  if (room) {
    return (
      <>
        <Title title="Edit room" activateNavigation />
        <RoomForm room={room} />
      </>
    );
  }
  return null;
}

export default RoomEdit;
