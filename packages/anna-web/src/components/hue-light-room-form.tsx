import React from 'react';

import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';

import { Form, redirect, useActionData } from 'react-router-dom';
import { fetcher } from 'src/utils';
import type { Room as RoomType } from 'types/room';
import type { HueLight as HueLightType } from 'types/hue-light';
import type { ErrorForm } from 'src/types/error-form';

type Props = {
  rooms: RoomType[];
  hueLights: HueLightType[];
  roomId: string;
  hueLightId: string;
};

type HueLightRoomForm = {
  roomId: string;
  hueLightId: string;
};
function HueLightRoomForm({ rooms, hueLights, hueLightId, roomId }: Props) {
  const errors = useActionData() as ErrorForm;

  return (
    <Form method="post" className="flex flex-col gap-4">
      {errors && <Alert>Invalid form</Alert>}
      <Select
        name="roomId"
        label="Room"
        defaultValue={roomId}
        options={rooms.map((room) => ({
          label: room.name,
          value: room.roomId,
        }))}
      />
      <Select
        name="hueLightId"
        label="Hue Light"
        defaultValue={hueLightId}
        options={hueLights.map((hueLight) => ({
          label: hueLight.name,
          value: hueLight.id,
        }))}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}

export const actionHueRoom = async ({ request }) => {
  const data = await request.formData();
  const hueLightId = data.get('hueLightId');
  const roomId = data.get('roomId');

  const res = await fetcher(`/api/hue/lights/${hueLightId}`, 'PATCH', {
    roomId,
  });

  if (!res.ok) {
    return { ok: false };
  }

  return redirect('/');
};

export default HueLightRoomForm;
