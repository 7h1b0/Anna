import React from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import Title from '@/components/title';

import { HueLight } from '@/types/hue-light';
import HueLightForm from '@/components/hue-light-form';
import { fetcher } from '@/utils';

function HueLightPage() {
  const { lightId = '' } = useParams<'lightId'>();
  const hueLight = useLoaderData() as HueLight;

  hueLight.id = lightId;
  return (
    <>
      <Title title={hueLight.name} activateNavigation />
      <HueLightForm hueLight={hueLight} />
    </>
  );
}

export default HueLightPage;

export async function loaderHueLight({ params }) {
  return fetcher(`/api/hue/lights/${params.lightId}`);
}
