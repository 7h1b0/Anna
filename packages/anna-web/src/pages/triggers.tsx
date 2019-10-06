import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Trigger from 'components/trigger';
import Grid from 'components/grid';

import useFetch from 'src/hooks/use-fetch';
import { Trigger as TriggerType } from 'types/trigger';

const Triggers: React.FC<RouteComponentProps> = () => {
  const triggers = useFetch<TriggerType>('/api/alias');

  return (
    <>
      <Header title="Triggers" />
      <Grid column={1}>
        {triggers.map(el => (
          <Trigger trigger={el} />
        ))}
      </Grid>
    </>
  );
};

export default Triggers;
