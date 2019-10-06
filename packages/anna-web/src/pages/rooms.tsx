import React from 'react';

import Header from 'components/header';
import Room from 'components/room';
import Grid from 'src/components/grid';

import useFetch from 'src/hooks/use-fetch';
import { Room as RoomType } from 'types/room';

const Routines: React.FC<{}> = () => {
  const rooms = useFetch<RoomType>('/api/rooms');

  return (
    <>
      <Header title="Rooms" />
      <Grid column={1}>
        {rooms.map(el => (
          <Room key={el.roomId} room={el} />
        ))}
      </Grid>
    </>
  );
};

export default Routines;
