import React from 'react';

import Header from 'components/header';
import Trigger from 'components/trigger';
import Grid from 'components/grid';

import useFetch from 'src/hooks/use-fetch';
import { Trigger as TriggerType } from 'types/trigger';

const Triggers: React.FC<{}> = () => {
  const triggers = useFetch<TriggerType>('/api/alias');

  return (
    <>
      <Header title="Triggers" />
      <Grid column={1}>
        {triggers.map(el => (
          <Trigger key={el.aliasId} trigger={el} />
        ))}
      </Grid>
    </>
  );
};

export default Triggers;
