import React from 'react';

import Title from '@/components/title';
import TriggerForm from '@/components/trigger-form';

import type { Scene as SceneType } from '@/types/scene';
import { useLoaderData } from 'react-router';

function TriggerAdd() {
  const scenes = useLoaderData() as SceneType[];
  const trigger = {
    aliasId: '',
    sceneId: '',
    name: '',
    description: '',
    enabled: true,
  };

  return (
    <>
      <Title title="Add Trigger" activateNavigation />
      <TriggerForm trigger={trigger} scenes={scenes} />
    </>
  );
}

export default TriggerAdd;
