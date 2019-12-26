import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import useRequest from 'hooks/use-request';

import Select from 'components/select';
import Checkbox from 'components/checkbox';
import { Trigger as TriggerType } from 'types/trigger';
import { Scene as SceneType } from 'types/scene';

function reducer(
  state: TriggerType,
  action: Partial<TriggerType>,
): TriggerType {
  return Object.assign({}, state, action);
}

type Props = {
  trigger: TriggerType;
  scenes: SceneType[];
};

const TriggerForm: React.FC<Props> = ({ trigger, scenes }) => {
  const [updatedTrigger, dispatch] = React.useReducer(reducer, trigger);
  const request = useRequest();

  const handleChange = (prop: keyof TriggerType) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    dispatch({
      // @ts-ignore
      [prop]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, sceneId, enabled } = updatedTrigger;
    await request(`/api/alias/${trigger.aliasId}`, 'PATCH', {
      name,
      description,
      sceneId,
      enabled,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="name"
        label="name"
        value={updatedTrigger.name}
        onChange={handleChange('name')}
      />
      <Input
        name="description"
        label="description"
        value={updatedTrigger.description}
        onChange={handleChange('description')}
      />
      <Select
        name="sceneId"
        label="Scene"
        value={updatedTrigger.sceneId}
        onChange={handleChange('sceneId')}
        options={scenes.map(scene => ({
          label: scene.name,
          value: scene.sceneId,
        }))}
      />
      <Checkbox
        name="enabled"
        label="enabled"
        checked={updatedTrigger.enabled}
        onChange={handleChange('enabled')}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default TriggerForm;
