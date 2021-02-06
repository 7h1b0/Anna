import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Typography from './typography';
import Card from './card';
import type { HueLight as HueLightType } from 'types/hue-light';

type Props = {
  hueLight: HueLightType;
};
function HueLight({ hueLight }: Props) {
  const { on, hex } = hueLight.state;
  const isColorLight = hueLight.type === 'Extended color light';

  return (
    <Link to={`/home/rooms/light/${hueLight.id}`}>
      <Card className="items-center">
        {isColorLight && (
          <div
            className="rounded-full h-8 w-8 bg-black cursor-pointer"
            style={{ backgroundColor: hex }}
          />
        )}
        <div className="px-4 flex-1">
          <Typography>{hueLight.name}</Typography>
          <Typography variant="caption">{on ? 'On' : 'Off'}</Typography>
        </div>
        <ArrowIcon className="fill-current h-4 w-4" />
      </Card>
    </Link>
  );
}

export default HueLight;
