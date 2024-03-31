import React from 'react';

import Title from '@/components/title';
import Trigger from '@/components/trigger';
import Typography from '@/components/typography';
import ButtonAdd from '@/components/button-add';

import { fetcher, groupBy } from '@/utils';
import type { Trigger as TriggerType } from '@/types/trigger';
import { useLoaderData } from 'react-router';

function Triggers() {
  const triggers = useLoaderData() as TriggerType[];

  const [enabledTriggers, disabledTriggers] = groupBy(
    triggers,
    (triggers) => triggers.enabled,
  );
  return (
    <>
      <Title title="Triggers" action={<ButtonAdd to="/triggers/add" />} />
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

export async function loaderTriggers() {
  return fetcher('/api/alias');
}
