import React from 'react';

type Props = {
  on: boolean;
};

function Switch({ on = true }: Props) {
  const justifyContent = on ? 'flex-end' : 'flex-start';
  const backgroundColor = on ? 'bg-teal-500' : 'bg-gray-500';
  return (
    <div>
      <div
        className="flex items-center h-6 w-12 bg-gray-900 rounded-full"
        style={{ justifyContent }}
      >
        <div className={`w-6 h-6 rounded-full bg-white ${backgroundColor}`} />
      </div>
    </div>
  );
}

export default Switch;
