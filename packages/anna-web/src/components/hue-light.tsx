import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Typography from './typography';
import Card from './card';
import type { HueLight as HueLightType } from 'types/hue-light';

const HueLight: React.FC<{
  hueLight: HueLightType;
}> = ({ hueLight }) => {
  const { on, hex } = hueLight.state;

  return (
    <Link to={`/rooms/light/${hueLight.id}`}>
      <Card className="items-center">
        <div
          className="rounded-full h-8 w-8 bg-black cursor-pointer"
          style={{ backgroundColor: hex }}
        />
        <div className="px-4 flex-1">
          <Typography>{hueLight.name}</Typography>
          <Typography variant="caption">{on ? 'On' : 'Off'}</Typography>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
};

export default HueLight;
