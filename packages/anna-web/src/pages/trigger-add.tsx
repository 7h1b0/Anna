import React from 'react';

import Title from 'src/components/title';
import TriggerForm from 'components/trigger-form';

import useFetch from 'hooks/use-fetch';

import type { Scene as SceneType } from 'types/scene';

function TriggerAdd() {
  const scenes = useFetch<SceneType[]>('/api/scenes');
  const trigger = {
    aliasId: '',
    sceneId: '',
    name: '',
    description: '',
    enabled: true,
  };

  if (scenes) {
    return (
      <>
        <Title title="Add Trigger" activateNavigation />
        <TriggerForm trigger={trigger} scenes={scenes} />
      </>
    );
  }
  return null;
}

export default TriggerAdd;
