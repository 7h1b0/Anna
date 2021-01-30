import React from 'react';
import { Link } from 'react-router-dom';

import Card from './card';
import Typography from './typography';
import { ArrowIcon } from './icons';

import { formatDate } from 'utils';
import type { Routine as RoutineType } from 'types/routine';

type Props = {
  routine: RoutineType;
};
function Routine({ routine }: Props) {
  return (
    <Link to={`/routines/${routine.routineId}`}>
      <Card className="justify-between items-center">
        <div>
          <Typography>{routine.name}</Typography>
          <Typography variant="caption">
            {`Next: ${
              routine.enabled ? formatDate(routine.nextRunAt) : 'Disabled'
            }`}
          </Typography>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
}

export default Routine;
