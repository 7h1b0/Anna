import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Scene from 'components/scene';
import ContainerList from 'components/container-list';

// import useFetch from 'src/hooks/use-fetch';

// import { Scene as SceneType } from 'types/scene';

const fixtures = [
  {
    sceneId: '4f58b400-8c72-4c6f-9c42-2c38a62ed1fb',
    name: 'Watching',
    description: 'Watching Television',
    createdAt: 1563039356000,
    updatedAt: 1563039356000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: '5e6a0565-d93d-4dcc-a692-08f9f1d8ffc2',
    name: 'Work',
    description: 'For work',
    createdAt: 1563039351000,
    updatedAt: 1563039351000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: '6e0bc62a-4f0a-42f8-a0b9-f054db7165bf',
    name: 'Dyson On',
    description: 'Dyson On',
    createdAt: 1563039385000,
    updatedAt: 1563039385000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: 'a5a4146d-ed64-4eaf-b831-453947ecfaea',
    name: 'Dyson Off',
    description: 'Dyson Off',
    createdAt: 1563039391000,
    updatedAt: 1563039391000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: 'abfff1db-8aaf-4e3a-a8ce-7e1ddb8cd864',
    name: 'Off',
    description: 'Leave home',
    createdAt: 1563039316000,
    updatedAt: 1563039316000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: 'b881a683-850d-4638-b08f-48832f721884',
    name: 'Kodi Pause',
    description: 'Pause',
    createdAt: 1563039414000,
    updatedAt: 1563039414000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: 'd552ad52-131e-4c56-920a-5dd792bb126d',
    name: 'Morning',
    description: 'Morning',
    createdAt: 1563039297000,
    updatedAt: 1563039297000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
  {
    sceneId: 'd6723a42-2201-4e68-b794-d18024af9d81',
    name: 'Night',
    description: 'Night',
    createdAt: 1563039338000,
    updatedAt: 1563039338000,
    createdBy: '00745cb2-7332-4d5a-adee-500cf6bca747',
  },
];

const Scenes: React.FC<RouteComponentProps> = () => {
  // const scenes = useFetch<SceneType>('/api/scenes');

  return (
    <>
      <Header title="Scenes" subtitle="Welcome Plop" />
      <ContainerList>
        {fixtures.map(({ name, description, sceneId }) => (
          <Scene
            key={sceneId}
            sceneId={sceneId}
            name={name}
            description={description}
          />
        ))}
      </ContainerList>
    </>
  );
};

export default Scenes;
