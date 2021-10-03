import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Card from './card';
import type { Trigger as TriggerType } from 'types/trigger';
import Typography from './typography';

const Triggers: React.FC<{
  trigger: TriggerType;
}> = ({ trigger }) => {
  const hasTimeCondition =
    Number.isInteger(trigger.startTime) && Number.isInteger(trigger.endTime);
  return (
    <Link to={`/triggers/${trigger.aliasId}`}>
      <Card className="justify-between items-center">
        <div>
          <Typography>{trigger.description}</Typography>
          <Typography variant="caption">{trigger.name}</Typography>
          {hasTimeCondition && (
            <Typography variant="caption">
              From {trigger.startTime}h to {trigger.endTime}h
            </Typography>
          )}
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};

export default Triggers;
