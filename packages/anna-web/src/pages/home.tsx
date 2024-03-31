import React from 'react';

import Typography from 'components/typography';
import Scene from 'components/scene';
import Room from 'components/room';
import Grid from 'components/grid';
import Title from 'components/title';
import { Link, useLoaderData } from 'react-router-dom';
import { SettingsIcon } from 'components/icons';
import { fetcher } from 'src/utils';

import type { Scene as SceneType } from 'types/scene';
import type { Room as RoomType } from 'types/room';

function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

function Home() {
  const { scenes, rooms } = useLoaderData() as LoaderHome;

  return (
    <>
      <Title
        title="Home Dashboard"
        subtitle={<>Welcome Home </>}
        action={
          <Link to="/settings" className="fill-current text-white">
            <SettingsIcon className="w-5" />
          </Link>
        }
      />
      <Typography className="mt-4 mb-2 text-teal-500" variant="heading">
        Rooms
      </Typography>
      <Grid>
        {rooms.sort(sortByName).map((el) => (
          <Room key={el.roomId} room={el} />
        ))}
      </Grid>
      <Typography className="mt-4 mb-2 text-teal-500" variant="heading">
        Favorites Scenes
      </Typography>
      <section className="grid grid-cols-3 xl:grid-cols-6 gap-2">
        {scenes.sort(sortByName).map(({ description, name, sceneId }) => (
          <Scene
            key={sceneId}
            sceneId={sceneId}
            name={name}
            description={description}
          />
        ))}
      </section>
    </>
  );
}

export default Home;

type LoaderHome = {
  scenes: SceneType[];
  rooms: RoomType[];
};
export async function loaderHome() {
  const [scenes, rooms] = await Promise.all([
    fetcher('/api/scenes/favorites'),
    fetcher('/api/rooms'),
  ]);

  return { scenes, rooms };
}
