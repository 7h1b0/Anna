import React from 'react';

import Typographie from './typographie';

import useAction from 'hooks/use-action';

const Scene: React.FC<{
  sceneId: string;
  name: string;
  description: string;
}> = ({ sceneId, name, description }) => {
  const callScene = useAction(`/api/scenes/${sceneId}/action`);
  return (
    <div
      role="button"
      onClick={callScene}
      className="text-gray-200 p-2 w-1/2 xl:w-1/6"
    >
      <div className=" flex justify-between items-center rounded bg-gray-800 p-2 xl:p-4">
        <div>
          <Typographie>{name}</Typographie>
          <Typographie variant="caption">{description}</Typographie>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="fill-current h-4 w-4"
        >
          <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
        </svg>
      </div>
    </div>
  );
};

export default Scene;
