import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Card from './card';
import { Trigger as TriggerType } from 'types/trigger';
import Typographie from './typographie';

const Triggers: React.FC<{
  trigger: TriggerType;
}> = ({ trigger }) => {
  return (
    <Link to={`/triggers/${trigger.aliasId}`}>
      <Card>
        <div>
          <Typographie>{trigger.description}</Typographie>
          <Typographie variant="caption">{trigger.name}</Typographie>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};

export default Triggers;
