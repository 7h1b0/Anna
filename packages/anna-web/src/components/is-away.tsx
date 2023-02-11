import React from 'react';
import { useUser } from 'src/hooks/use-user';
import useRequest from 'src/hooks/use-request';
import Card from './card';
import Switch from './switch';
import { useRevalidator } from 'react-router-dom';

function IsAway() {
  const user = useUser();
  const request = useRequest();
  const revalidator = useRevalidator();

  async function handleClick() {
    const newStatus = !user.isAway;
    await request('api/user', 'PATCH', {
      isAway: newStatus,
    });
    revalidator.revalidate();
  }

  return (
    <Card
      className="items-center justify-between mb-6"
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div>
        <p>Away mode</p>
        <p className="text-xs text-gray-300">
          Routine will not run when you are away
        </p>
      </div>
      <Switch on={user.isAway} />
    </Card>
  );
}

export default IsAway;
