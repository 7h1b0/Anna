import React from 'react';

export type User = {
  token: string | null;
  username: string | null;
  isAway: boolean;
};

const UserStateContext = React.createContext<User | null>(null);
const UserDispatchContext = React.createContext<(user: User) => void>(
  () => void 0,
);

export const useUser = () => React.useContext(UserStateContext);
export const useAuthenticatedUser = () => {
  const user = React.useContext(UserStateContext);
  if (!user) {
    throw new Error('User is not defined. Use useUser instead');
  }
  return user;
};
export const useSetUser = () => React.useContext(UserDispatchContext);

export const UserProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = React.useState(() => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return { username, token, isAway: false };
  });

  React.useEffect(() => {
    localStorage.setItem('username', user.username || '');
    localStorage.setItem('token', user.token || '');
  }, [user]);

  React.useEffect(() => {
    const headers: Record<string, string> = {
      'x-access-token': user.token ?? '',
    };
    fetch('/api/user', { method: 'GET', headers })
      .then((res) => res.json())
      .then(({ username, isAway }) => {
        setUser((state) => ({ ...state, username, isAway }));
      });
  }, [user.token]);

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
