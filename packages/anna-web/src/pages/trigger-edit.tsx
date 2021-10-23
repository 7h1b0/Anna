import React from 'react';
import { useParams } from 'react-router-dom';

import Title from 'src/components/title';
import TriggerForm from 'components/trigger-form';

import useFetch from 'hooks/use-fetch';

import type { Trigger as TriggerType } from 'types/trigger';
import type { Scene as SceneType } from 'types/scene';

function TriggerEdit() {
  const { triggerId = '' } = useParams<'triggerId'>();
  const trigger = useFetch<TriggerType>(`/api/alias/${triggerId}`);
  const scenes = useFetch<SceneType[]>('/api/scenes');

  if (trigger && scenes) {
    return (
      <>
        <Title title="Trigger Form" activateNavigation />
        <TriggerForm trigger={trigger} scenes={scenes} />
      </>
    );
  }
  return null;
}

export default TriggerEdit;
