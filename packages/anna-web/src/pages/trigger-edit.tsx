import React from 'react';
import { useLoaderData } from 'react-router-dom';

import Title from '@/components/title';
import TriggerForm from '@/components/trigger-form';

import type { Trigger as TriggerType } from '@/types/trigger';
import type { Scene as SceneType } from '@/types/scene';
import { fetcher } from '@/utils';

function TriggerEdit() {
  const { trigger, scenes } = useLoaderData() as LoaderTriggerEdit;

  return (
    <>
      <Title title="Trigger Form" activateNavigation />
      <TriggerForm trigger={trigger} scenes={scenes} />
    </>
  );
}

export default TriggerEdit;

type LoaderTriggerEdit = {
  scenes: SceneType[];
  trigger: TriggerType;
};
export async function loaderTriggerEdit({ params }) {
  const [trigger, scenes] = await Promise.all([
    fetcher(`/api/alias/${params.triggerId}`),
    fetcher('/api/scenes'),
  ]);

  return { trigger, scenes };
}
