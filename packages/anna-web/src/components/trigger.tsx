import React from 'react';

import { Trigger as TriggerType } from 'types/trigger';
import Typographie from './typographie';

const Triggers: React.FC<{
  trigger: TriggerType;
}> = ({ trigger }) => {
  return (
    <div className="rounded bg-gray-800 text-gray-200 p-2 my-2 w-full">
      <Typographie>{trigger.description}</Typographie>
      <Typographie variant="caption">{trigger.name}</Typographie>
    </div>
  );
};

export default Triggers;
