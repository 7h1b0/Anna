import React from 'react';
import { Link } from 'react-router-dom';
import debounce from 'debounce';

import { ArrowIcon } from './icons';
import useRequest from 'hooks/use-request';
import Typographie from './typographie';
import { HueLight as HueLightType } from 'types/hue-light';

const HueLight: React.FC<{
  hueLight: HueLightType;
}> = ({ hueLight }) => {
  const { on, hex, bri } = hueLight.state;
  const [color, setColor] = React.useState(hex || '#000');
  const request = useRequest();
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceHandleColor(e.target.value);
  };

  const updateColor = async (hexColor: string) => {
    setColor(hexColor);
    try {
      await request(`/api/hue/lights/${hueLight.id}/state`, 'PATCH', {
        hex: hexColor,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const debounceHandleColor = debounce(updateColor, 1000);

  return (
    <div className="text-gray-200 px-1 w-1/2 xl:w-1/6">
      <Link to={`/rooms/light/${hueLight.id}`}>
        <div className="flex text-gray-200 rounded items-center bg-gray-800 p-4 mb-2">
          <label>
            <div
              className="rounded-full h-8 w-8 bg-black cursor-pointer"
              style={{ backgroundColor: color }}
            />
            <input
              type="color"
              className="hidden"
              value={color}
              onChange={handleColorChange}
            />
          </label>
          <div className="px-1 flex-1">
            <Typographie>{hueLight.name}</Typographie>
            {on ? (
              <Typographie variant="caption">Brightness: {bri}</Typographie>
            ) : (
              <Typographie variant="caption">Off</Typographie>
            )}
          </div>
          <ArrowIcon className="fill-current h-4 w-4" />
        </div>
      </Link>
    </div>
  );
};

export default HueLight;
