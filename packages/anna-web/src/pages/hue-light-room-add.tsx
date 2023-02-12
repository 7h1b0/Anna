import React from 'react';

import Title from 'components/title';
import HueLightRoomForm from 'components/hue-light-room-form';

import type { HueLight as HueLightType } from 'types/hue-light';
import type { Room as RoomType } from 'types/room';
import { fetcher } from 'src/utils';
import { useLoaderData } from 'react-router';

function LightAdd() {
  const { hueLights, rooms } = useLoaderData() as LoaderLightAdd;

  return (
    <>
      <Title title="Add Light to Room" activateNavigation />
      <HueLightRoomForm
        hueLights={hueLights}
        rooms={rooms}
        roomId=""
        hueLightId=""
      />
    </>
  );
}

export default LightAdd;

type LoaderLightAdd = {
  hueLights: HueLightType[];
  rooms: RoomType[];
};
export async function loaderLightAdd() {
  const [hueLights, rooms] = await Promise.all([
    fetcher('/api/hue/lights'),
    fetcher('/api/rooms'),
  ]);

  return { hueLights, rooms };
}
