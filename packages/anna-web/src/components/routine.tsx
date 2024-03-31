import React from 'react';
import { Link } from 'react-router-dom';

import Card from './card';
import Typography from './typography';
import { ArrowIcon } from './icons';

import { formatDate, getUser } from 'utils';
import type { Routine as RoutineType } from 'types/routine';

function computeNextRun(routine: RoutineType, isUserAway: boolean) {
  if (isUserAway && !routine.runWhenAway) {
    return 'Will be skipped';
  }
  if (routine.enabled) {
    return formatDate(routine.nextRunAt);
  }
  return 'Disabled';
}

type Props = {
  routine: RoutineType;
};
function Routine({ routine }: Props) {
  const user = getUser();
  const next = computeNextRun(routine, user.isAway);

  return (
    <Link to={`/routines/${routine.routineId}`}>
      <Card className="justify-between items-center">
        <div>
          <Typography>{routine.name}</Typography>
          <Typography variant="caption">{`Next: ${next}`}</Typography>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
}

export default Routine;
