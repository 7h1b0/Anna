import React from 'react';

import type { Preset } from '@/preset-hue';
import Typography from '@/components/typography';

type Props = {
  preset: Preset;
  updateState: (payload) => void;
  dispatch: Function;
};

function PresetHue({ preset, updateState, dispatch }: Props) {
  function handlePreset() {
    const payload = {
      on: true,
      bri: preset.bri,
      xy: preset.xy,
    };
    dispatch({ type: 'UPDATE_STATE', data: { ...payload, hex: preset.hex } });
    updateState(payload);
  }

  return (
    <div
      className="focus:ring-2 focus:ring-blue-600"
      role="button"
      tabIndex={0}
      onClick={handlePreset}
      onKeyPress={handlePreset}
    >
      <div
        className="rounded-full h-10 w-10 bg-black m-auto "
        style={{ backgroundColor: preset.hex }}
      />
      <Typography className="mt-2 text-center">{preset.name}</Typography>
    </div>
  );
}

export default PresetHue;
