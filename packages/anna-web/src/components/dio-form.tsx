import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';

import { redirect, useActionData } from 'react-router-dom';
import { fetcher } from 'src/utils';
import type { Dio as DioType } from 'types/dio';
import type { Room as RoomType } from 'types/room';
import type { ErrorForm } from 'types/error-form';

type Props = {
  rooms: RoomType[];
  dio: DioType;
};

type DioForm = {
  dioId: number;
  name: string;
  roomId: string;
};
function DioForm({ rooms, dio }: Props) {
  const errors = useActionData() as ErrorForm;

  return (
    <form className="flex flex-col gap-4">
      {errors && <Alert>Invalid form</Alert>}
      <Input
        name="dioId"
        label="dio ID"
        type="number"
        defaultValue={`${dio.dioId}`}
      />
      <Input name="name" label="name" defaultValue={dio.name} />
      <Select
        name="roomId"
        label="Room"
        defaultValue={dio.roomId}
        options={rooms.map((room) => ({
          label: room.name,
          value: room.roomId,
        }))}
      />
      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export const actionDio = async ({ request }) => {
  const data = Object.fromEntries(await request.formData());
  const res = await fetcher(`/api/dios`, 'POST', data);

  if (!res.ok) {
    return { ok: false };
  }

  return redirect('/');
};

export default DioForm;
