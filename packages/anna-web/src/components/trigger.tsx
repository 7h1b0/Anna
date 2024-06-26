import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Card from './card';
import type { Trigger as TriggerType } from '@/types/trigger';
import Typography from './typography';

const Triggers: React.FC<{
  trigger: TriggerType;
}> = ({ trigger }) => {
  const hasTimeCondition = trigger.startTime || trigger.endTime;
  return (
    <Link to={`/triggers/${trigger.aliasId}`}>
      <Card className="justify-between items-center">
        <div>
          <Typography variant="heading">{trigger.description}</Typography>

          <Typography variant="caption">
            {hasTimeCondition
              ? `From ${trigger.startTime}h to ${trigger.endTime}h`
              : 'Always'}
          </Typography>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};

export default Triggers;
