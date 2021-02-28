import React from 'react';

import Title from 'src/components/title';
import SceneForm from 'src/components/scene-form';

import useFetch from 'hooks/use-fetch';

import type { Dio as DioType } from 'types/dio';
import type { HueLight as HueLightType } from 'types/hue-light';

function SceneAdd() {
  const hueLights = useFetch<HueLightType>(`/api/hue/lights`);
  const dios = useFetch<DioType[]>('/api/dios');

  if (hueLights && dios) {
    return (
      <>
        <Title title="Scene Form" activateNavigation />
        <SceneForm hueLights={hueLights} dios={dios} />
      </>
    );
  }
  return null;
}

export default SceneAdd;
