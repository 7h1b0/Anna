import React from 'react';

import Card from 'components/card';
import RangeVertical from 'components/range-vertical';
import Typography from 'components/typography';
import Switch from 'components/switch';
import Grid from 'components/grid';

import useRequest from 'hooks/use-request';
import useDebounce from 'hooks/use-debounce';
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

  const updateState = async (payload: Payload) => {
    try {
      await request(`/api/hue/lights/${hueLight.id}/state`, 'PATCH', payload);
    } catch (error) {
      console.log(error);
    }
  };
  const debounce = useDebounce(updateState, 1000);

  const { on, bri, hex } = hueLight.state;

  const handleToggleState = () => {
    updateState({ on: !on });
    dispatch({ type: 'TOGGLE_STATE' });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexColor = e.target.value;
    dispatch({ type: 'UPDATE_COLOR', data: hexColor });
    debounce({ hex: hexColor });
  };

  const handleBrightnessChange = (bri: number) => {
    dispatch({ type: 'UPDATE_BRIGHTNESS', data: bri });
    debounce({ bri });
  };

  return (
    <div>
      <RangeVertical
        min={0}
        max={254}
        value={bri}
        onChange={handleBrightnessChange}
      />

      <Grid>
        <Card className="flex-col items-center justify-center">
          <label className="h-full w-full cursor-pointer text-center">
            <div
              className="rounded-full h-10 w-10 bg-black m-auto"
              style={{ backgroundColor: hex }}
            />
            <Typography className="mt-2">Color</Typography>
            <input
              type="color"
              className="hidden"
              value={hex}
              onChange={handleColorChange}
            />
          </label>
        </Card>

        <Card
          className="flex-col items-center justify-center"
          role="button"
          onClick={handleToggleState}
        >
          <Switch on={on} />
          <Typography className="mt-2">Toggle On/Off</Typography>
        </Card>
      </Grid>
    </div>
  );
};

export default HueLightRoom;
