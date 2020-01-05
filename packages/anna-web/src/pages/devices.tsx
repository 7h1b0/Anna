import React from 'react';
import { useParams } from 'react-router';

import useFetch from 'hooks/use-fetch';
import { Dio as DioType } from 'types/dio';
import { HueLight as HueLightType } from 'types/hue-light';

import Title from 'src/components/title';
import Dio from 'src/components/dio';
import HueLight from 'src/components/hue-light';

const Devices: React.FC<{}> = () => {
  const params = useParams<{ roomId: string }>();

  const dios = useFetch<DioType[]>('/api/dios');
  const hueLights = useFetch<HueLightType[]>('/api/hue/lights');

  console.log(dios, hueLights);

  if (dios && hueLights) {
    return (
      <>
        <Title title="Devices" />
        <p>{params.roomId}</p>
        {dios.map(dio => (
          <Dio key={dio.dioId} name={dio.name} dioId={dio.dioId} />
        ))}
        {hueLights.map(huelight => (
          <HueLight key={huelight.id} hueLight={huelight} />
        ))}
      </>
    );
  }
  return null;
};

export default Devices;
