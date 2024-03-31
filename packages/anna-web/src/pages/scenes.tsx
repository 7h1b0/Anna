import React from 'react';

import Scene from '@/components/scene';
import Title from '@/components/title';

import type { Scene as SceneType } from '@/types/scene';
import { fetcher } from '@/utils';
import { useLoaderData } from 'react-router';

function sortByName(a: SceneType, b: SceneType) {
  return a.name.localeCompare(b.name);
}

function Scenes() {
  const scenes = useLoaderData() as SceneType[];

  return (
    <>
      <Title title="Scenes" />
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
        {scenes.sort(sortByName).map(({ name, sceneId }) => (
          <Scene key={sceneId} sceneId={sceneId} name={name} />
        ))}
      </div>
    </>
  );
}

export default Scenes;

export async function loaderScenes() {
  return fetcher('/api/scenes');
}
