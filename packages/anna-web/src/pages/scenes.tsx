import React from 'react';

import Header from 'components/header';
import Scene from 'components/scene';
import Grid from 'src/components/grid';

import useFetch from 'src/hooks/use-fetch';

import { Scene as SceneType } from 'types/scene';

const Scenes: React.FC<{}> = () => {
  const scenes = useFetch<SceneType>('/api/scenes');

  return (
    <>
      <Header title="Scenes" subtitle="Welcome Plop" />
      <Grid margin>
        {scenes.map(({ name, description, sceneId }) => (
          <Scene
            key={sceneId}
            sceneId={sceneId}
            name={name}
            description={description}
          />
        ))}
      </Grid>
    </>
  );
};

export default Scenes;
