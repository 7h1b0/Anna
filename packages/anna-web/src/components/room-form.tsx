import React from 'react';
import { useForm } from 'react-hook-form';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';

import useRequest from 'hooks/use-request';
import { useHistory } from 'react-router-dom';
import type { Room as RoomType } from 'types/room';

type Props = {
  room: RoomType;
};

type RoomForm = {
  name: string;
  description: string;
};
function RoomForm({ room }: Props) {
  const { register, handleSubmit } = useForm<RoomForm>({
    defaultValues: {
      name: room.name,
      description: room.description,
    },
  });
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const history = useHistory();

  async function onSubmit(data: RoomForm) {
    try {
      if (room.roomId) {
        await request(`/api/rooms/${room.roomId}`, 'PATCH', data);
      } else {
        await request(`/api/rooms`, 'POST', data);
      }
      history.goBack();
    } catch (error) {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {hasError && <Alert>Invalid form</Alert>}
      <Input name="name" label="name" register={register('name')} />
      <Input
        name="description"
        label="description"
        register={register('description')}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default RoomForm;
