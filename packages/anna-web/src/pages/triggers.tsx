import React from 'react';

import Title from 'src/components/title';
import Trigger from 'components/trigger';
import Typography from 'components/typography';
import Loader from 'components/loader';
import FloatingButton from 'components/button-add';

import useFetch from 'hooks/use-fetch';
import { groupBy } from 'modules/array';
import type { Trigger as TriggerType } from 'types/trigger';

function Triggers() {
  const triggers = useFetch<TriggerType[]>('api/alias');

  if (triggers === null) {
    return <Loader />;
  }

  const [enabledTriggers, disabledTriggers] = groupBy(
    triggers,
    (triggers) => triggers.enabled,
  );
  return (
    <>
      <Title title="Triggers" />
      <FloatingButton to="/triggers/add" />
      <div className="mt-4">
        <Typography variant="heading">Enabled</Typography>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {enabledTriggers.map((triggers) => (
            <Trigger key={triggers.aliasId} trigger={triggers} />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <Typography variant="heading">Disabled</Typography>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {disabledTriggers.map((triggers) => (
            <Trigger key={triggers.aliasId} trigger={triggers} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Triggers;
