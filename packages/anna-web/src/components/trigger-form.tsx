import React from 'react';
import { useForm } from 'react-hook-form';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';
import Grid from 'components/grid';

import useRequest from 'hooks/use-request';
import { useHistory } from 'react-router-dom';
import type { Trigger as TriggerType } from 'types/trigger';
import type { Scene as SceneType } from 'types/scene';

type Props = {
  trigger: TriggerType;
  scenes: SceneType[];
};

type TriggerForm = {
  name: string;
  description: string;
  sceneId: string;
  enabled: boolean;
  startTime?: number;
  endTime?: number;
};
function TriggerForm({ trigger, scenes }: Props) {
  const { register, handleSubmit } = useForm<TriggerForm>({
    defaultValues: {
      name: trigger.name,
      description: trigger.description,
      sceneId: trigger.sceneId,
      enabled: trigger.enabled,
      startTime: trigger.startTime,
      endTime: trigger.endTime,
    },
  });
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const history = useHistory();
  const isEditMode = trigger.aliasId !== '';

  async function onSubmit(data: TriggerForm) {
    const {
      name,
      description = '',
      sceneId,
      enabled,
      startTime,
      endTime,
    } = data;

    try {
      if (isEditMode) {
        await request(`/api/alias/${trigger.aliasId}`, 'PATCH', {
          name: trigger.name,
          description,
          sceneId,
          enabled,
          startTime,
          endTime,
        });
      } else {
        await request('/api/alias/', 'POST', {
          name,
          description,
          sceneId,
          enabled,
          startTime,
          endTime,
        });
      }
      history.push('/triggers');
    } catch (error) {
      setError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {hasError && <Alert>Invalid form</Alert>}
      <Input
        name="name"
        label="name"
        register={register('name')}
        disabled={isEditMode}
      />
      <Input
        name="description"
        label="description"
        register={register('description')}
      />
      <Select
        name="sceneId"
        label="Scene"
        register={register('sceneId')}
        options={scenes.map((scene) => ({
          label: scene.name,
          value: scene.sceneId,
        }))}
      />
      <Grid>
        <Input
          name="startTime"
          label="From"
          register={register('startTime', {
            valueAsNumber: true,
            min: 0,
            max: 23,
          })}
          type="number"
        />
        <Input
          name="endTime"
          label="to"
          register={register('endTime', {
            valueAsNumber: true,
            min: 0,
            max: 23,
          })}
          type="number"
        />
      </Grid>
      <Checkbox name="enabled" label="enabled" register={register('enabled')} />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default TriggerForm;
