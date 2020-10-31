import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Card from './card';
import Typography from './typography';

import type { Room as RoomType } from 'types/room';

const Room: React.FC<{
  room: RoomType;
}> = ({ room }) => {
  return (
    <Link to={`/rooms/${room.roomId}`}>
      <Card className="justify-between items-center">
        <Typography>{room.name}</Typography>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};
export default Room;
