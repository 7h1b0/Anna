import React from 'react';

import Typographie from './typographie';
import useAction from 'hooks/use-action';

const Dio: React.FC<{
  dioId: number;
  name: string;
}> = ({ dioId, name }) => {
  const handleOn = useAction(`/api/dios/${dioId}/on`);
  const handleOff = useAction(`/api/dios/${dioId}/off`);

  return (
    <div className="text-gray-200 px-1 w-1/2 xl:w-1/6">
      <div className="text-gray-200 rounded bg-gray-800 p-4 mb-2">
        <div className="flex justify-between items-center">
          <Typographie>{name}</Typographie>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="fill-current h-4 w-4"
          >
            <path d="M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z" />
          </svg>
        </div>
        <div className="flex justify-around items-center">
          <button onClick={handleOn}>ON</button>
          <button onClick={handleOff}>OFF</button>
        </div>
      </div>
    </div>
  );
};

export default Dio;
