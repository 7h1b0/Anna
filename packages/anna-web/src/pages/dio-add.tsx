import React from 'react';

import Title from 'components/title';
import DioForm from 'components/dio-form';

import useFetch from 'hooks/use-fetch';
import type { Room as RoomType } from 'types/room';

function DioAdd() {
  const rooms = useFetch<RoomType[]>('/api/rooms');
  const dio = {
    dioId: -1,
    name: '',
    roomId: '',
  };

  if (rooms) {
    return (
      <>
        <Title title="Add Dio" activateNavigation />
        <DioForm dio={dio} rooms={rooms} />
      </>
    );
  }
  return null;
}

export default DioAdd;
