import React from 'react';
import { useForm } from 'react-hook-form';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';

import useRequest from 'hooks/use-request';
import { useHistory } from 'react-router-dom';
import type { Routine as RoutineType } from 'types/routine';
import type { Scene as SceneType } from 'types/scene';

type Props = {
  routine: RoutineType;
  scenes: SceneType[];
};

type RoutineForm = {
  name: string;
  interval: string;
  sceneId: string;
  runAtBankHoliday: boolean;
  enabled: boolean;
};
function RoutineForm({ routine, scenes }: Props) {
  const { register, handleSubmit } = useForm<RoutineForm>({
    defaultValues: {
      name: routine.name,
      interval: routine.interval,
      sceneId: routine.sceneId,
      runAtBankHoliday: routine.runAtBankHoliday,
      enabled: routine.enabled,
    },
  });
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const history = useHistory();

  async function onSubmit(data: RoutineForm) {
    try {
      if (routine.routineId) {
        await request(`/api/routines/${routine.routineId}`, 'PATCH', data);
      } else {
        await request(`/api/routines`, 'POST', data);
      }
      history.goBack();
    } catch (error) {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {hasError && <Alert>Invalid form</Alert>}
      <Input name="name" label="name" register={register()} />
      <Input name="interval" label="interval" register={register()} />
      <Select
        name="sceneId"
        label="Scene"
        register={register()}
        options={scenes.map((scene) => ({
          label: scene.name,
          value: scene.sceneId,
        }))}
      />
      <Checkbox
        name="runAtBankHoliday"
        label="Run on bank holiday"
        register={register()}
      />
      <Checkbox name="enabled" label="enabled" register={register()} />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default RoutineForm;
