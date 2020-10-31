import React from 'react';

import Scene from 'components/scene';
import Loader from 'components/loader';
import Title from 'src/components/title';

import useFetch from 'hooks/use-fetch';

import type { Scene as SceneType } from 'types/scene';

function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

function Scenes() {
  const scenes = useFetch<SceneType[]>(`/api/scenes`);

  if (scenes === null) {
    return <Loader />;
  }
  return (
    <>
      <Title title="Scenes" subtitle={`${scenes.length} scenes available`} />
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
        {scenes.sort(sortByName).map(({ name, sceneId, description }) => (
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
}

export default Scenes;
