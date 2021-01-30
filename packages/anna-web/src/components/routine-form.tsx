import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';

import useRequest from 'hooks/use-request';
import { useHistory } from 'react-router-dom';
import type { Routine as RoutineType } from 'types/routine';
import type { Scene as SceneType } from 'types/scene';

function reducer(
  state: RoutineType,
  action: Partial<RoutineType>,
): RoutineType {
  return Object.assign({}, state, action);
}

type Props = {
  routine: RoutineType;
  scenes: SceneType[];
};

function RoutineForm({ routine, scenes }: Props) {
  const [updatedRoutine, dispatch] = React.useReducer(reducer, routine);
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const history = useHistory();

  const handleChange = (prop: keyof RoutineType) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    dispatch({
      // @ts-ignore
      [prop]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      name,
      interval,
      sceneId,
      enabled,
      runAtBankHoliday,
    } = updatedRoutine;
    try {
      if (routine.routineId) {
        await request(`/api/routines/${routine.routineId}`, 'PATCH', {
          name,
          interval,
          sceneId,
          enabled,
          runAtBankHoliday,
        });
      } else {
        await request(`/api/routines`, 'POST', {
          name,
          interval,
          sceneId,
          enabled,
          runAtBankHoliday,
        });
      }
      history.goBack();
    } catch (error) {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasError && <Alert>Invalid form</Alert>}
      <Input
        name="name"
        label="name"
        value={updatedRoutine.name}
        onChange={handleChange('name')}
      />
      <Input
        name="interval"
        label="interval"
        value={updatedRoutine.interval}
        onChange={handleChange('interval')}
      />
      <Select
        name="sceneId"
        label="Scene"
        value={updatedRoutine.sceneId}
        onChange={handleChange('sceneId')}
        options={scenes.map((scene) => ({
          label: scene.name,
          value: scene.sceneId,
        }))}
      />
      <Checkbox
        name="runAtBankHoliday"
        label="Run on bank holiday"
        checked={updatedRoutine.runAtBankHoliday}
        onChange={handleChange('runAtBankHoliday')}
      />
      <Checkbox
        name="enabled"
        label="enabled"
        checked={updatedRoutine.enabled}
        onChange={handleChange('enabled')}
      />

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default RoutineForm;
