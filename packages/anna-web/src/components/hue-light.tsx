import React from 'react';
import { Link } from 'react-router-dom';

import { ArrowIcon } from './icons';
import Typography from './typography';
import { HueLight as HueLightType } from 'types/hue-light';

const HueLight: React.FC<{
  hueLight: HueLightType;
}> = ({ hueLight }) => {
  const { on, hex } = hueLight.state;

  return (
    <div className="text-gray-200 px-1 w-1/2 xl:w-1/6">
      <Link to={`/rooms/light/${hueLight.id}`}>
        <div className="flex text-gray-200 rounded items-center bg-gray-800 p-4 mb-2">
          <div
            className="rounded-full h-8 w-8 bg-black cursor-pointer"
            style={{ backgroundColor: hex }}
          />
          <div className="px-4 flex-1">
            <Typography>{hueLight.name}</Typography>
            <Typography variant="caption">{on ? 'On' : 'Off'}</Typography>
          </div>
          <ArrowIcon className="fill-current h-4 w-4" />
        </div>
      </Link>
    </div>
  );
};

export default HueLight;
