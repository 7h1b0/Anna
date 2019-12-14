import React from 'react';

import Title from 'src/components/title';
import Scene from 'components/scene';

import { useDataStore } from 'context/db-context';

import { Scene as SceneType } from 'types/scene';

const Scenes: React.FC<{}> = () => {
  const scenes = useDataStore<SceneType>('scenes');

  if (scenes === null) {
    return <p>Loading</p>;
  }
  return (
    <>
      <Title title="Scenes" />
      <div className="flex flex-wrap -mx-1">
        {scenes.map(({ name, description, sceneId }) => (
          <Scene
            key={sceneId}
            sceneId={sceneId}
            name={name}
            description={description}
          />
        ))}
      </div>
    </>
  );
};

export default Scenes;
