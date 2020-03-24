import React from 'react';
import { useParams } from 'react-router-dom';

import useFetch from 'hooks/use-fetch';
import Title from 'src/components/title';

import { HueLight } from 'src/types/hue-light';
import HueLightForm from 'components/hue-light-form';

const HueLightPage: React.FC<{}> = () => {
  const { lightId = '' } = useParams();
  const hueLight = useFetch<HueLight>(`/api/hue/lights/${lightId}`);

  if (hueLight) {
    hueLight.id = lightId;
    return (
      <>
        <Title title={hueLight.name} activateNavigation />
        <HueLightForm hueLight={hueLight} />
      </>
    );
  }
  return null;
};

export default HueLightPage;
