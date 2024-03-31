import React from 'react';

import Title from 'src/components/title';
import RoutineForm from 'components/routine-form';
import { useLoaderData } from 'react-router';

import type { Scene as SceneType } from 'types/scene';

function RoutineAdd() {
  const scenes = useLoaderData() as SceneType[];
  const routine = {
    routineId: '',
    name: '',
    interval: '0 5 * * *',
    sceneId: '',
    runAtBankHoliday: false,
    runWhenAway: false,
    enabled: true,
    nextRunAt: -1,
  };

  return (
    <>
      <Title title="Add Routine" activateNavigation />
      <RoutineForm routine={routine} scenes={scenes} />
    </>
  );
}

export default RoutineAdd;
