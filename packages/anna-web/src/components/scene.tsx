import React from 'react';

import Typography from './typography';
import Card from './card';

import useAction from 'hooks/use-action';

type Props = {
  name: string;
  sceneId: string;
  description?: string;
};
const Scene: React.FC<Props> = ({ sceneId, name, description }) => {
  const callScene = useAction(`/api/scenes/${sceneId}/action`);

  return (
    <Card role="button" onClick={callScene} className="flex-col text-blue-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="fill-current h-6 w-6"
      >
        <path d="M4 4l12 6-12 6z" />
      </svg>

      <Typography className="mt-2">{name}</Typography>
      <Typography variant="caption">{description}</Typography>
    </Card>
  );
};

export default Scene;
