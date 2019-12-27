import React from 'react';

import Title from 'src/components/title';
import Trigger from 'components/trigger';
import Typographie from 'components/typographie';

import { useDataStoreGetAll } from 'context/db-context';
import { groupBy } from 'modules/array';
import { Trigger as TriggerType } from 'types/trigger';

const Triggers: React.FC<{}> = () => {
  const triggers = useDataStoreGetAll<TriggerType>('triggers');

  if (triggers === null) {
    return <p>Loading</p>;
  }

  const [enabledTriggers, disabledTriggers] = groupBy(
    triggers,
    triggers => triggers.enabled,
  );
  return (
    <>
      <Title title="Triggers" />
      <Typographie>Enabled</Typographie>
      <div>
        {enabledTriggers.map(triggers => (
          <Trigger key={triggers.aliasId} trigger={triggers} />
        ))}
      </div>
      <Typographie>Disabled</Typographie>
      <div>
        {disabledTriggers.map(triggers => (
          <Trigger key={triggers.aliasId} trigger={triggers} />
        ))}
      </div>
    </>
  );
};

export default Triggers;
