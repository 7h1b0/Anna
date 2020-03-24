import React from 'react';

import Button from 'components/button';
import Preset from 'components/preset';
import Typographie from 'components/typographie';
import debounce from 'debounce';

import useRequest from 'hooks/use-request';
import { HueLight } from 'src/types/hue-light';

type TOGGLE_STATE = {
  type: 'TOGGLE_STATE';
};

type UPDATE_COLOR = {
  type: 'UPDATE_COLOR';
  data: string;
};

type UPDATE_BRIGHTNESS = {
  type: 'UPDATE_BRIGHTNESS';
  data: number;
};

type UPDATE_STATE = {
  type: 'UPDATE_STATE';
  data: Required<Payload>;
};

type Payload = {
  bri?: number;
  hex?: string;
  on?: boolean;
};

type Preset = {
  title: string;
  bri: number;
  hex: string;
  on: boolean;
};

const presets: Preset[] = [
  { title: 'Bisque', bri: 254, hex: '#FFE5AD', on: true },
  { title: 'Alice Blue', bri: 253, hex: '#f0f7ff', on: true },
  { title: 'Dark Blue', bri: 200, hex: '#483d8c', on: true },
  { title: 'Rebeca Purple', bri: 200, hex: '#66339a', on: true },
  { title: 'Indian Red', bri: 100, hex: '#d05a5a', on: true },
  { title: 'Dark Red', bri: 100, hex: '#8c0000', on: true },
];

function reducer(
  state: HueLight,
  action: TOGGLE_STATE | UPDATE_COLOR | UPDATE_BRIGHTNESS | UPDATE_STATE,
): HueLight {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case 'TOGGLE_STATE':
      newState.state.on = !state.state.on;
      return newState;
    case 'UPDATE_COLOR':
      newState.state.hex = action.data;
      return newState;
    case 'UPDATE_BRIGHTNESS':
      newState.state.bri = action.data;
      return newState;
    case 'UPDATE_STATE':
      newState.state = action.data;
      return newState;
  }
}

type Props = {
  hueLight: HueLight;
};

const HueLightRoom: React.FC<Props> = (props) => {
  const [hueLight, dispatch] = React.useReducer(reducer, props.hueLight);
  const request = useRequest();

  const { on, bri, hex } = hueLight.state;

  const updateState = async (payload: Payload) => {
    try {
      await request(`/api/hue/lights/${hueLight.id}/state`, 'PATCH', payload);
    } catch (error) {
      console.log(error);
    }
  };
  const debounceState = debounce(updateState, 1000);

  const handleToggleState = () => {
    updateState({ on: !on });
    dispatch({ type: 'TOGGLE_STATE' });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    dispatch({ type: 'UPDATE_COLOR', data: hexColor });
    debounceState({ hex: hexColor });
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bri = Number(e.target.value);
    dispatch({ type: 'UPDATE_BRIGHTNESS', data: bri });
    debounceState({ bri });
  };

  const handlePreset = ({ bri, hex, on }: Preset) => () => {
    const newState = { bri, hex, on };
    dispatch({ type: 'UPDATE_STATE', data: newState });
    updateState(newState);
  };

  return (
    <div>
      <div className="grid grid-cols-3 xl:grid-cols-6 gap-2">
        {presets.map((preset) => (
          <Preset
            key="preset.title"
            title={preset.title}
            hexColor={preset.hex}
            onClick={handlePreset(preset)}
          />
        ))}
      </div>
      <div className="flex flex-col items-center text-center">
        <label className="my-8">
          <div
            className="rounded-full h-20 w-20 bg-black cursor-pointer my-2"
            style={{ backgroundColor: hex }}
          />
          <Typographie>Color</Typographie>
          <input
            type="color"
            className="hidden"
            value={hex}
            onChange={handleColorChange}
          />
        </label>

        <label className="block w-full my-8">
          <input
            type="range"
            min="0"
            max="254"
            value={bri}
            onChange={handleBrightnessChange}
            className="block w-full"
          />
          <Typographie>Brightness: {bri}</Typographie>
        </label>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleToggleState}>Toggle state</Button>
      </div>
    </div>
  );
};

export default HueLightRoom;
