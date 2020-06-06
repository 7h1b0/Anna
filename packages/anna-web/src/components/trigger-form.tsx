import React from 'react';

import Input from 'components/input';
import Button from 'components/button';
import Alert from 'components/alert';
import Select from 'components/select';
import Checkbox from 'components/checkbox';

import useRequest from 'hooks/use-request';
import { useHistory } from 'react-router-dom';
import type { Trigger as TriggerType } from 'types/trigger';
import type { Scene as SceneType } from 'types/scene';

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
  const [hasError, setError] = React.useState(false);
  const request = useRequest();
  const history = useHistory();

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
    const { name, description = '', sceneId, enabled } = updatedTrigger;
    try {
      await request(`/api/alias/${trigger.aliasId}`, 'PATCH', {
        name,
        description,
        sceneId,
        enabled,
      });
      history.push('/triggers');
    } catch (error) {
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {hasError && <Alert>Invalid form</Alert>}
      <Input
        name="name"
        label="name - read only"
        value={updatedTrigger.name}
        onChange={handleChange('name')}
        disabled
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
        options={scenes.map((scene) => ({
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

      <div className="flex justify-center">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

export default TriggerForm;
