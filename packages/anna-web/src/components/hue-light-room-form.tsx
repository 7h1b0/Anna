import React from 'react';
import { useForm } from 'react-hook-form';

import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';

import useRequest from 'hooks/use-request';
import { useNavigate } from 'react-router-dom';
import type { Room as RoomType } from 'types/room';
import type { HueLight as HueLightType } from 'types/hue-light';

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
  const { register, handleSubmit } = useForm<HueLightRoomForm>({
    defaultValues: {
      roomId,
      hueLightId,
    },
  });
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const navigate = useNavigate();

  async function onSubmit(data: HueLightRoomForm) {
    try {
      await request(`/api/hue/lights/${data.hueLightId}`, 'PATCH', {
        roomId: data.roomId,
      });
      navigate(-1);
    } catch (error) {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {hasError && <Alert>Invalid form</Alert>}
      <Select
        name="roomId"
        label="Room"
        register={register('roomId')}
        options={rooms.map((room) => ({
          label: room.name,
          value: room.roomId,
        }))}
      />
      <Select
        name="hueLightId"
        label="Hue Light"
        register={register('hueLightId')}
        options={hueLights.map((hueLight) => ({
          label: hueLight.name,
          value: hueLight.id,
        }))}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default HueLightRoomForm;
