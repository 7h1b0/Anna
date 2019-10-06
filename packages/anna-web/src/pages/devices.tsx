import React from 'react';
import { useParams } from 'react-router';

import Header from 'components/header';

const Devices: React.FC<{}> = () => {
  const params = useParams<{ roomId: string }>();
  return (
    <>
      <Header title="Devices" />
      <p>{params.roomId}</p>
    </>
  );
};

export default Devices;
