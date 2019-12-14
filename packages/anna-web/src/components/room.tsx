import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Card from './card';
import Typographie from './typographie';

import { Room as RoomType } from 'types/room';

const Room: React.FC<{
  room: RoomType;
}> = ({ room }) => {
  return (
    <Link to={`/rooms/${room.roomId}`}>
      <Card>
        <Typographie>{room.name}</Typographie>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};

export default Room;
