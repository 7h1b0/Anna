import React from 'react';

import Header from 'components/header';
import Trigger from 'components/trigger';
import Typographie from 'components/typographie';

import useFetch from 'src/hooks/use-fetch';
import { groupBy } from 'modules/array';
import { Trigger as TriggerType } from 'types/trigger';

const Triggers: React.FC<{}> = () => {
  const triggers = useFetch<TriggerType>('/api/alias');

  const [enabledTriggers, disabledTriggers] = groupBy(
    triggers,
    triggers => triggers.enabled,
  );
  return (
    <>
      <Header title="Triggers" />
      <Typographie>Enabled</Typographie>
      <div className="flex flex-wrap">
        {enabledTriggers.map(triggers => (
          <Trigger key={triggers.aliasId} trigger={triggers} />
        ))}
      </div>
      <Typographie>Disabled</Typographie>
      <div className="flex flex-wrap">
        {disabledTriggers.map(triggers => (
          <Trigger key={triggers.aliasId} trigger={triggers} />
        ))}
      </div>
    </>
  );
};

export default Triggers;
