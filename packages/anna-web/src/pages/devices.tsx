import React from 'react';
import { useParams } from 'react-router';

import useFetch from 'hooks/use-fetch';
import { Room as RoomType } from 'types/room';

import Title from 'src/components/title';
import Typography from 'components/typography';
import Dio from 'src/components/dio';
import HueLight from 'src/components/hue-light';

const Devices: React.FC<{}> = () => {
  const params = useParams<{ roomId: string }>();

  const room = useFetch<RoomType>(`/api/rooms/${params.roomId}`);

  if (room && room.devices) {
    const hasACPower = room.devices.dios.length > 0;
    const hasLight = room.devices.hueLights.length > 0;
    return (
      <>
        <Title title={room.name} activateNavigation />
        {hasACPower && (
          <div className="mt-4">
            <Typography variant="heading">AC power</Typography>
            <div className="flex flex-wrap -mx-1">
              {room.devices.dios.map((dio) => (
                <Dio key={dio.dioId} name={dio.name} dioId={dio.dioId} />
              ))}
            </div>
          </div>
        )}
        {hasLight && (
          <div className="mt-4">
            <Typography variant="heading">Lights</Typography>
            <div className="flex flex-wrap -mx-1">
              {room.devices.hueLights.map((huelight) => (
                <HueLight key={huelight.id} hueLight={huelight} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
  return null;
};

export default Devices;
