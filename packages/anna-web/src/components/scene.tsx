import React from 'react';

import Card from './card';
import Typographie from './typographie';

import useAction from 'hooks/use-action';

const Scene: React.FC<{
  sceneId: string;
  name: string;
  description: string;
}> = ({ sceneId, name, description }) => {
  const callScene = useAction(`/api/scenes/${sceneId}/action`);
  return (
    <Card role="button" onClick={callScene}>
      <Typographie>{name}</Typographie>
      <Typographie variant="caption">{description}</Typographie>
    </Card>
  );
};

export default Scene;
