import React from 'react';
import { useParams } from 'react-router';

import Title from 'src/components/title';

const Devices: React.FC<{}> = () => {
  const params = useParams<{ roomId: string }>();
  return (
    <>
      <Title title="Devices" />
      <p>{params.roomId}</p>
    </>
  );
};

export default Devices;
