import React from 'react';

import Title from 'src/components/title';
import Routine from 'components/routine';
import Loader from 'components/loader';

import useFetch from 'hooks/use-fetch';
import type { Routine as RoutineType } from 'types/routine';

const Routines: React.FC<{}> = () => {
  const routines = useFetch<RoutineType[]>('/api/routines');

  if (routines === null) {
    return <Loader />;
  }

  return (
    <>
      <Title title="Routines" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {routines
          .sort((a, b) => a.nextRunAt - b.nextRunAt)
          .map((el) => (
            <Routine key={el.routineId} routine={el} />
          ))}
      </div>
    </>
  );
};

export default Routines;
