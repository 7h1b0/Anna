import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Routine from 'components/routine';
import ContainerList from 'components/container-list';

import useFetch from 'src/hooks/use-fetch';
import { Routine as RoutineType } from 'types/routine';

const Triggers: React.FC<RouteComponentProps> = () => {
  const triggers = useFetch<RoutineType>('/api/triggers');

  return (
    <>
      <Header title="Triggers" />
      <ContainerList column={1}>
        {triggers.map(({ name, lastRunAt, routineId }) => (
          <Routine
            key={routineId}
            routineId={routineId}
            name={name}
            lastRunAt={lastRunAt}
          />
        ))}
      </ContainerList>
    </>
  );
};

export default Triggers;
