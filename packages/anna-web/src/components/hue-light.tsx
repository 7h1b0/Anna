import React from 'react';
import debounce from 'debounce';

import Typographie from './typographie';
import { HueLight as HueLightType } from 'types/hue-light';

const HueLight: React.FC<{
  hueLight: HueLightType;
}> = ({ hueLight }) => {
  const [color, setColor] = React.useState('#fff');
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceHandleColor(e.target.value);
  };

  const updateColor = (hexColor: string) => {
    setColor(hexColor);
  };
  const debounceHandleColor = debounce(updateColor, 1000);

  return (
    <div className="text-gray-200 px-1 w-1/2 xl:w-1/6">
      <div className=" flex text-gray-200 rounded bg-gray-800 p-4 mb-2">
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
        <div className="flex justify-between items-center">
          <Typographie>{hueLight.name}</Typographie>
        </div>
      </div>
    </div>
  );
};

export default HueLight;
