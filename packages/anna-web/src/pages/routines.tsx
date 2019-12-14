import React from 'react';

import Title from 'src/components/title';
import Routine from 'components/routine';

import { useDataStore } from 'context/db-context';
import { Routine as RoutineType } from 'types/routine';

const Routines: React.FC<{}> = () => {
  const routines = useDataStore<RoutineType>('routines');

  if (routines === null) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Title title="Routines" />
      {routines
        .sort((a, b) => a.nextRunAt - b.nextRunAt)
        .map(el => (
          <Routine key={el.routineId} routine={el} />
        ))}
    </>
  );
};

export default Routines;
