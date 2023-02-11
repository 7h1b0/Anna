import { useRouteLoaderData } from 'react-router-dom';

export type User = {
  token: string | null;
  username: string | null;
  isAway: boolean;
};

export const useUser = () => {
  const user = useRouteLoaderData('me') as User;
  return user;
};
