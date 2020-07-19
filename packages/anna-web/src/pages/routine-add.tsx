import React from 'react';

import Title from 'src/components/title';
import RoutineForm from 'components/routine-form';

import useFetch from 'hooks/use-fetch';
import type { Scene as SceneType } from 'types/scene';

function RoutineAdd() {
  const scenes = useFetch<SceneType[]>('/api/scenes');
  const routine = {
    routineId: '',
    name: '',
    interval: '0 5 * * *',
    sceneId: '',
    runAtBankHoliday: false,
    enabled: true,
    nextRunAt: -1,
  };

  if (scenes) {
    return (
      <>
        <Title title="Add Routine" activateNavigation />
        <RoutineForm routine={routine} scenes={scenes} />
      </>
    );
  }
  return null;
}

export default RoutineAdd;
