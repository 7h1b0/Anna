import React from 'react';
import { Form, redirect, useActionData } from 'react-router-dom';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';

import { fetcher } from 'src/utils';
import type { Room } from 'types/room';
import type { ErrorForm } from 'types/error-form';

type RoomForm = {
  name: string;
  description: string;
};
function RoomForm({ room }: { room: Room }) {
  const errors = useActionData() as ErrorForm;

  return (
    <Form className="flex flex-col gap-4" method="post">
      {errors && <Alert>Invalid form</Alert>}
      <Input name="name" label="name" minLength={3} defaultValue={room.name} />
      <Input
        name="description"
        label="description"
        minLength={3}
        defaultValue={room.description}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}

export const actionRoom = async ({ request, params }) => {
  const data = Object.fromEntries(await request.formData());

  const res = params.roomId
    ? await fetcher(`/api/rooms/${params.roomId}`, 'PATCH', data)
    : await fetcher(`/api/rooms`, 'POST', data);

  if (!res.ok) {
    return { ok: false };
  }

  return redirect('/');
};

export default RoomForm;
