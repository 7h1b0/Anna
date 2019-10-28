import React from 'react';

import { Trigger as TriggerType } from 'types/trigger';
import Card from './card';
import Typographie from './typographie';

const Triggers: React.FC<{
  trigger: TriggerType;
}> = ({ trigger }) => {
  return (
    <Card>
      <Typographie>{trigger.description}</Typographie>
      <Typographie variant="caption">{trigger.name}</Typographie>
    </Card>
  );
};

export default Triggers;
