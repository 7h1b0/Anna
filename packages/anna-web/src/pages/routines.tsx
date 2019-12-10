import React from 'react';

import Header from 'components/header';
import Routine from 'components/routine';

import useFetch from 'src/hooks/use-fetch';
import { Routine as RoutineType } from 'types/routine';

const Routines: React.FC<{}> = () => {
  const routines = useFetch<RoutineType>('/api/routines');

  return (
    <>
      <Header title="Routines" />
      {routines
        .sort((a, b) => a.nextRunAt - b.nextRunAt)
        .map(el => (
          <Routine key={el.routineId} routine={el} />
        ))}
    </>
  );
};

export default Routines;
