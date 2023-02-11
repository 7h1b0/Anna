import React from 'react';

import Typography from 'components/typography';
import Scene from 'components/scene';
import Room from 'components/room';
import Grid from 'components/grid';
import Loader from 'components/loader';
import Title from 'components/title';
import { Link } from 'react-router-dom';
import { SettingsIcon } from 'components/icons';

import useFetch from 'hooks/use-fetch';
import { useUser } from 'hooks/use-user';

import type { Scene as SceneType } from 'types/scene';
import type { Room as RoomType } from 'types/room';

function sortByName(a, b) {
  return a.name.localeCompare(b.name);
}

function Home() {
  const user = useUser();
  const scenes = useFetch<SceneType[]>(`/api/scenes/favorites`);
  const rooms = useFetch<RoomType[]>(`/api/rooms`);

  if (scenes === null || rooms === null) {
    return <Loader />;
  }
  return (
    <>
      <Title
        title="Home Dashboard"
        subtitle={
          <>
            Welcome Home{' '}
            <span className="text-blue-500 capitalize">{user?.username}</span>
          </>
        }
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
