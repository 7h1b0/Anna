import React from 'react';

import Typography from './typography';
import Card from './card';
import useAction from 'hooks/use-action';

const Dio: React.FC<{
  dioId: number;
  name: string;
}> = ({ dioId, name }) => {
  const handleOn = useAction(`/api/dios/${dioId}/on`);
  const handleOff = useAction(`/api/dios/${dioId}/off`);

  return (
    <Card className="flex-col">
      <div className="flex justify-between items-center">
        <Typography>{name}</Typography>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="fill-current h-4 w-4"
        >
          <path d="M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z" />
        </svg>
      </div>
      <div className="flex justify-around items-center">
        <button onClick={handleOn} className="text-blue-500">
          ON
        </button>
        <button onClick={handleOff} className="text-blue-500">
          OFF
        </button>
      </div>
    </Card>
  );
};

export default Dio;
