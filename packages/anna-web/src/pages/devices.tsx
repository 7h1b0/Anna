import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Header from 'components/header';
import Room from 'components/room';
import Grid from 'src/components/grid';

const Devices: React.FC<RouteComponentProps> = () => {
  return (
    <>
      <Header title="Devices" />
    </>
  );
};

export default Devices;
