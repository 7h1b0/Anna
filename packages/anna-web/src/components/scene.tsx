import React from 'react';

import Typography from './typography';

import useAction from 'hooks/use-action';

const Scene: React.FC<{
  sceneId: string;
  name: string;
}> = ({ sceneId, name }) => {
  const callScene = useAction(`/api/scenes/${sceneId}/action`);
  return (
    <div
      role="button"
      onClick={callScene}
      className={`text-gray-200 rounded bg-gray-800 p-4 hover:bg-gray-700`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="fill-current h-6 w-6"
      >
        <path d="M4 4l12 6-12 6z" />
      </svg>
      <Typography className="mt-2">{name}</Typography>
    </div>
  );
};

export default Scene;
