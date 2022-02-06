import React from 'react';
import { useSetUser, useAuthenticatedUser } from 'src/context/user-context';
import useRequest from 'src/hooks/use-request';
import Card from './card';
import Switch from './switch';

function IsAway() {
  const user = useAuthenticatedUser();
  const setUser = useSetUser();
  const request = useRequest();

  async function handleClick() {
    const newStatus = !user.isAway;
    await request('api/user', 'PATCH', {
      isAway: newStatus,
    });
    setUser({ ...user, isAway: newStatus });
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
