import React from 'react';
import { useParams } from 'react-router-dom';

import Title from 'src/components/title';
import RoutineForm from 'components/routine-form';

import useFetch from 'hooks/use-fetch';
import type { Routine as RoutineType } from 'types/routine';
import type { Scene as SceneType } from 'types/scene';

function RoutineEdit() {
  const { routineId = '' } = useParams<{ routineId: string }>();
  const routine = useFetch<RoutineType>(`/api/routines/${routineId}`);
  const scenes = useFetch<SceneType[]>('/api/scenes');

  if (routine && scenes) {
    return (
      <>
        <Title title="Edit Routine" activateNavigation />
        <RoutineForm routine={routine} scenes={scenes} />
      </>
    );
  }
  return null;
}

export default RoutineEdit;
