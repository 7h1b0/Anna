import React from 'react';

import Scene from 'components/scene';
import Title from 'src/components/title';

import type { Scene as SceneType } from 'types/scene';
import { fetcher } from 'src/utils';
import { useLoaderData } from 'react-router';

function sortByName(a: SceneType, b: SceneType) {
  return a.name.localeCompare(b.name);
}

function Scenes() {
  const scenes = useLoaderData() as SceneType[];

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

export async function loaderScenes() {
  return fetcher('/api/scenes');
}
