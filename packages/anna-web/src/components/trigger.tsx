import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Card from './card';
import { Trigger as TriggerType } from 'types/trigger';
import Typography from './typography';

const Triggers: React.FC<{
  trigger: TriggerType;
}> = ({ trigger }) => {
  return (
    <Link to={`/triggers/${trigger.aliasId}`}>
      <Card>
        <div>
          <Typography>{trigger.description}</Typography>
          <Typography variant="caption">{trigger.name}</Typography>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};

export default Triggers;
