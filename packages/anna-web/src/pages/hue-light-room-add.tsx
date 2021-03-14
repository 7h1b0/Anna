import React from 'react';

import Title from 'components/title';
import HueLightRoomForm from 'components/hue-light-room-form';

import useFetch from 'hooks/use-fetch';
import type { HueLight as HueLightType } from 'types/hue-light';
import type { Room as RoomType } from 'types/room';

function LightAdd() {
  const hueLights = useFetch<HueLightType[]>('/api/hue/lights');
  const rooms = useFetch<RoomType[]>('/api/rooms');

  if (hueLights && rooms) {
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
  return null;
}

export default LightAdd;
