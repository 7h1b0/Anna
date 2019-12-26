import React from 'react';
import { useParams } from 'react-router-dom';

import Title from 'src/components/title';
import TriggerForm from 'components/trigger-form';

import useFetch from 'src/hooks/use-fetch';
import { useDataStore } from 'context/db-context';

import { Trigger as TriggerType } from 'types/trigger';
import { Scene as SceneType } from 'types/scene';

const TriggerEdit: React.FC<{}> = () => {
  const { triggerId } = useParams();
  const trigger = useFetch<TriggerType>(`/api/alias/${triggerId}`);
  const scenes = useDataStore<SceneType>('scenes');

  if (trigger && scenes) {
    return (
      <>
        <Title title="Trigger Form" />
        <TriggerForm trigger={trigger} scenes={scenes} />
      </>
    );
  }
  return null;
};

export default TriggerEdit;
