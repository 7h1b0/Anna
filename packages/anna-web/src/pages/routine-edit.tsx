import React from 'react';
import { useParams } from 'react-router-dom';

import Title from 'src/components/title';
import RoutineForm from 'components/routine-form';

import { useDataStoreGetAll, useDataStoreGet } from 'context/db-context';

import type { Routine as RoutineType } from 'types/routine';
import type { Scene as SceneType } from 'types/scene';

const RoutineEdit: React.FC<{}> = () => {
  const { routineId = '' } = useParams();
  const routine = useDataStoreGet<RoutineType>('routines', routineId);
  const scenes = useDataStoreGetAll<SceneType>('scenes');

  if (routine && scenes) {
    return (
      <>
        <Title title="Routine Form" activateNavigation />
        <RoutineForm routine={routine} scenes={scenes} />
      </>
    );
  }
  return null;
};

export default RoutineEdit;
