import React from 'react';
import { useLoaderData } from 'react-router-dom';

import Title from '@/components/title';
import RoutineForm from '@/components/routine-form';

import type { Routine as RoutineType } from '@/types/routine';
import type { Scene as SceneType } from '@/types/scene';
import { fetcher } from '@/utils';

function RoutineEdit() {
  const { routine, scenes } = useLoaderData() as LoaderRoutineEdit;

  return (
    <>
      <Title title="Edit Routine" activateNavigation />
      <RoutineForm routine={routine} scenes={scenes} />
    </>
  );
}

export default RoutineEdit;

type LoaderRoutineEdit = {
  routine: RoutineType;
  scenes: SceneType[];
};
export async function loaderRoutineEdit({ params }) {
  const [routine, scenes] = await Promise.all([
    fetcher(`/api/routines/${params.routineId}`),
    fetcher('/api/scenes'),
  ]);

  return { routine, scenes };
}
