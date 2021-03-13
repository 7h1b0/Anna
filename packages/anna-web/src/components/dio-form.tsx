import React from 'react';
import { useForm } from 'react-hook-form';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';

import useRequest from 'hooks/use-request';
import { useHistory } from 'react-router-dom';
import type { Dio as DioType } from 'types/dio';
import type { Room as RoomType } from 'types/room';

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
  const { register, handleSubmit } = useForm<DioForm>({
    defaultValues: {
      dioId: dio.dioId,
      name: dio.name,
      roomId: dio.roomId,
    },
  });
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const history = useHistory();

  async function onSubmit(data: DioForm) {
    try {
      if (dio.dioId && dio.dioId >= 0) {
        await request(`/api/dios/${dio.dioId}`, 'PATCH', data);
      } else {
        await request(`/api/dios`, 'POST', data);
      }
      history.goBack();
    } catch (error) {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {hasError && <Alert>Invalid form</Alert>}
      <Input
        name="dioId"
        label="dio ID"
        type="number"
        register={register('dioId', {
          valueAsNumber: true,
        })}
      />
      <Input name="name" label="name" register={register('name')} />
      <Select
        name="roomId"
        label="Room"
        register={register('roomId')}
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

export default DioForm;
