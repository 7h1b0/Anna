import React from 'react';
import { useParams, useRouteLoaderData } from 'react-router';

import type { Room as RoomType } from 'types/room';

import Title from 'src/components/title';
import Typography from 'components/typography';
import Dio from 'src/components/dio';
import Grid from 'src/components/grid';
import HueLight from 'src/components/hue-light';
import ButtonEdit from 'src/components/button-edit';
import { fetcher } from 'src/utils';

function Room() {
  const { roomId } = useParams<'roomId'>();
  const room = useRouteLoaderData('room') as RoomType;

  const hasACPower = room.devices?.dios?.length > 0;
  const hasLight = room.devices?.hueLights?.length > 0;
  return (
    <>
      <Title
        title={room.name}
        activateNavigation
        action={<ButtonEdit to={`/home/rooms/${roomId}/edit`} />}
      />
      <Grid>
        {room.sensors.map((sensor) => {
          if (sensor.type === 'ZLLTemperature') {
            return (
              <div
                key={sensor.id}
                className="text-gray-200 flex flex-col rounded shadow-md bg-gray-800 p-4"
              >
                <Typography variant="caption">Sensor {sensor.id}:</Typography>
                <Typography variant="head">
                  {Math.round(sensor.state.temperature / 100)}
                  <span className="text-base pl-2">°C</span>
                </Typography>
              </div>
            );
          }
          return null;
        })}
      </Grid>
      {hasACPower && (
        <div className="mt-4">
          <Typography variant="heading" className="mt-4 mb-2 text-teal-500">
            AC power
          </Typography>
          <Grid>
            {room.devices.dios.map((dio) => (
              <Dio key={dio.dioId} name={dio.name} dioId={dio.dioId} />
            ))}
          </Grid>
        </div>
      )}
      {hasLight && (
        <div className="mt-4">
          <Typography variant="heading" className="mt-4 mb-2 text-teal-500">
            Lights
          </Typography>
          <Grid>
            {room.devices.hueLights.map((huelight) => (
              <HueLight key={huelight.id} hueLight={huelight} />
            ))}
          </Grid>
        </div>
      )}
    </>
  );
}

export default Room;

export async function loaderRoom({ params }) {
  return fetcher(`/api/rooms/${params.roomId}`);
}
