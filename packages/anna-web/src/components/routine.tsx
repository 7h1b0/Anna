import React from 'react';
import { Link } from 'react-router-dom';

import Card from './card';
import Typography from './typography';
import { ArrowIcon } from './icons';

import { formatDate } from 'modules/format';
import { Routine as RoutineType } from 'types/routine';

const Routine: React.FC<{
  routine: RoutineType;
}> = ({ routine }) => {
  return (
    <Link to={`/routines/${routine.routineId}`}>
      <Card>
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
};

export default Routine;
