import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';
import Grid from 'components/grid';

import { redirect, useActionData, useParams } from 'react-router-dom';
import type { Trigger as TriggerType } from 'types/trigger';
import type { Scene as SceneType } from 'types/scene';
import { fetcher } from 'src/utils';
import { ErrorForm } from 'src/types/error-form';

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
  const { aliasId } = useParams as { aliasId?: string };
  const errors = useActionData() as ErrorForm;
  const isEditMode = aliasId !== '';

  return (
    <form className="flex flex-col gap-4">
      {errors && <Alert>Invalid form</Alert>}
      <Input
        name="name"
        label="name"
        disabled={isEditMode}
        defaultValue={trigger.name}
      />
      <Input
        name="description"
        label="description"
        defaultValue={trigger.description}
      />
      <Select
        name="sceneId"
        label="Scene"
        defaultValue={trigger.sceneId}
        options={scenes.map((scene) => ({
          label: scene.name,
          value: scene.sceneId,
        }))}
      />
      <Grid>
        <Input
          name="startTime"
          label="From"
          min={'0'}
          max={'23'}
          type="number"
          defaultValue={`${trigger.startTime}`}
        />
        <Input
          name="endTime"
          label="to"
          min={'0'}
          max={'23'}
          type="number"
          defaultValue={`${trigger.startTime}`}
        />
      </Grid>
      <Checkbox
        name="enabled"
        label="enabled"
        defaultChecked={trigger.enabled}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export const actionTrigger = async ({ request, params }) => {
  const data = await request.formData();
  const payload = {
    name: data.get('name'),
    description: data.get('description'),
    sceneId: data.get('sceneId'),
    startTime: data.get('startTime'),
    endTime: data.get('endTime'),
    enabled: data.get('runAtBankHoliday') === 'on',
  };

  const res = params.aliasId
    ? await fetcher(`/api/alias/${params.aliasId}`, 'PATCH', payload)
    : await request('/api/alias/', 'POST', payload);

  if (!res.ok) {
    return { ok: false };
  }

  return redirect('/');
};

export default TriggerForm;
