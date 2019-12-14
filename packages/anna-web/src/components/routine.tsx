import React from 'react';

import Card from './card';
import Typographie from './typographie';
import { ArrowIcon } from './icons';

import { formatDate } from 'modules/format';
import { Routine as RoutineType } from 'types/routine';

const Routine: React.FC<{
  routine: RoutineType;
}> = ({ routine }) => {
  return (
    <Card>
      <div>
        <Typographie>{routine.name}</Typographie>
        <Typographie variant="caption">
          {`Next run: ${formatDate(routine.nextRunAt)}`}
        </Typographie>
        <Typographie variant="caption">
          {`Last run: ${formatDate(routine.lastRunAt)}`}
        </Typographie>
      </div>
      <ArrowIcon className="fill-current h-4 w-4" />
    </Card>
  );
};

export default Routine;
