import React from 'react';

import Title from '@/components/title';
import DioForm from '@/components/dio-form';

import type { Room as RoomType } from '@/types/room';
import { useLoaderData } from 'react-router';
import { fetcher } from '@/utils';

function DioAdd() {
  const rooms = useLoaderData() as RoomType[];
  const dio = {
    dioId: -1,
    name: '',
    roomId: '',
  };

  return (
    <>
      <Title title="Add Dio" activateNavigation />
      <DioForm dio={dio} rooms={rooms} />
    </>
  );
}

export default DioAdd;

export async function loaderDioAdd() {
  return fetcher('/api/rooms');
}
