import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Routine from 'components/routine';
import Grid from 'src/components/grid';

import useFetch from 'src/hooks/use-fetch';
import { Routine as RoutineType } from 'types/routine';

const Routines: React.FC<RouteComponentProps> = () => {
  const routines = useFetch<RoutineType>('/api/routines');

  return (
    <>
      <Header title="Routines" />
      <Grid column={1}>
        {routines
          .sort((a, b) => a.nextRunAt - b.nextRunAt)
          .map(el => (
            <Routine key={el.routineId} routine={el} />
          ))}
      </Grid>
    </>
  );
};

export default Routines;
