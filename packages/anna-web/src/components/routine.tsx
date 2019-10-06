import React from 'react';

import Card from './card';
import Typographie from './typographie';

import { formatDate } from 'modules/format';
import { Routine as RoutineType } from 'types/routine';

const Routine: React.FC<{
  routine: RoutineType;
}> = ({ routine }) => {
  return (
    <Card>
      <Typographie>{routine.name}</Typographie>
      <Typographie variant="caption">
        {`Next run: ${formatDate(routine.nextRunAt)}`}
      </Typographie>
      <Typographie variant="caption">
        {`Last run: ${formatDate(routine.lastRunAt)}`}
      </Typographie>
    </Card>
  );
};

export default Routine;
