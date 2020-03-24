import React from 'react';

import Typographie from './typographie';

const Preset: React.FC<{
  title: string;
  hexColor: string;
  onClick: () => void;
}> = ({ title, hexColor, onClick }) => {
  return (
    <div
      role="button"
      onClick={onClick}
      className="text-gray-200 flex flex-col justify-center items-center rounded bg-gray-800 p-4 hover:bg-gray-700"
    >
      <div
        className="rounded-full w-10 h-10 mb-2"
        style={{ backgroundColor: hexColor }}
      />
      <Typographie variant="caption">{title}</Typographie>
    </div>
  );
};

export default Preset;
