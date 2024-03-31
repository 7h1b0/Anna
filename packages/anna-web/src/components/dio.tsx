import React from 'react';

import Typography from './typography';
import Card from './card';
import useAction from '@/hooks/use-action';

type Props = {
  dioId: number;
  name: string;
};
function Dio({ dioId, name }: Props) {
  const handleOn = useAction(`/api/dios/${dioId}/on`);
  const handleOff = useAction(`/api/dios/${dioId}/off`);

  return (
    <Card className="flex-col gap-2 items-center pt-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="fill-current h-8 w-8"
      >
        <path d="M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z" />
      </svg>
      <Typography>{name}</Typography>
      <button onClick={handleOn} className="text-blue-500">
        ON
      </button>
      <button onClick={handleOff} className="text-blue-500">
        OFF
      </button>
    </Card>
  );
}

export default Dio;
