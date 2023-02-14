import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';

import { Form, redirect, useActionData } from 'react-router-dom';
import type { Routine as RoutineType } from 'types/routine';
import type { Scene as SceneType } from 'types/scene';
import type { ErrorForm } from 'types/error-form';
import { fetcher } from 'src/utils';

type Props = {
  routine: RoutineType;
  scenes: SceneType[];
};

type RoutineForm = {
  name: string;
  interval: string;
  sceneId: string;
  runAtBankHoliday: boolean;
  runWhenUserIsAway: boolean;
  enabled: boolean;
};
function RoutineForm({ routine, scenes }: Props) {
  const errors = useActionData() as ErrorForm;

  return (
    <Form method="post" className="flex flex-col gap-4">
      {errors && <Alert>Invalid form</Alert>}
      <Input
        name="name"
        label="name"
        defaultValue={routine.name}
        minLength={3}
      />
      <Input name="interval" label="interval" defaultValue={routine.interval} />
      <Select
        name="sceneId"
        label="Scene"
        options={scenes.map((scene) => ({
          label: scene.name,
          value: scene.sceneId,
        }))}
      />
      <Checkbox
        name="runAtBankHoliday"
        label="Run on bank holiday"
        defaultChecked={routine.runAtBankHoliday}
      />
      <Checkbox
        name="runWhenUserIsAway"
        label="Run when user is away"
        defaultChecked={routine.runWhenUserIsAway}
      />

      <Checkbox
        name="enabled"
        label="enabled"
        defaultChecked={routine.enabled}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
}

export const actionRoutine = async ({ request, params }) => {
  const data = await request.formData();
  const payload = {
    name: data.get('name'),
    sceneId: data.get('sceneId'),
    interval: data.get('interval'),
    enabled: data.get('enabled') === 'on',
    runAtBankHoliday: data.get('runAtBankHoliday') === 'on',
    runWhenUserIsAway: data.get('runWhenUserIsAway') === 'on',
  };

  const res = params.routineId
    ? await fetcher(`/api/routines/${params.routineId}`, 'PATCH', payload)
    : await fetcher(`/api/routines`, 'POST', payload);

  if (!res.ok) {
    return { ok: false };
  }

  return redirect('/');
};

export default RoutineForm;
