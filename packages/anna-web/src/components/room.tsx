import React from 'react';

import Card from './card';
import Typographie from './typographie';

import { Room as RoomType } from 'types/room';

const Room: React.FC<{
  room: RoomType;
}> = ({ room }) => {
  return (
    <Card>
      <Typographie>{room.name}</Typographie>
    </Card>
  );
};

export default Room;
