import React from 'react';

import Title from '@/components/title';
import Routine from '@/components/routine';
import ButtonAdd from '@/components/button-add';

import type { Routine as RoutineType } from '@/types/routine';
import IsAway from '@/components/is-away';
import { fetcher } from '@/utils';
import { useLoaderData } from 'react-router';

function Routines() {
  const routines = useLoaderData() as RoutineType[];

  return (
    <>
      <Title title="Routines" action={<ButtonAdd to="/routines/add" />} />
      <IsAway />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {routines
          .sort((a, b) => a.nextRunAt - b.nextRunAt)
          .map((el) => (
            <Routine key={el.routineId} routine={el} />
          ))}
      </div>
    </>
  );
}

export default Routines;

export async function loaderRoutines() {
  return fetcher('/api/routines');
}
