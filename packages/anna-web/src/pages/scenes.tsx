import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Scene from 'components/scene';
import ContainerList from 'components/container-list';

import useFetch from 'src/hooks/use-fetch';

import { Scene as SceneType } from 'types/scene';

const Scenes: React.FC<RouteComponentProps> = () => {
  const scenes = useFetch<SceneType>('/api/scenes');

  return (
    <>
      <Header title="Scenes" subtitle="Welcome Plop" />
      <ContainerList>
        {scenes.map(({ name, description, sceneId }) => (
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
