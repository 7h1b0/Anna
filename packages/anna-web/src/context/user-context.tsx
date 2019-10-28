import React from 'react';

type User = {
  token: string | null;
  username: string | null;
};

//    username: 'Plop',
// token: '1db05c1c3b989a0bf492171f86b2d9a1d681',

const UserStateContext = React.createContext<User | null>(null);
const UserDispatchContext = React.createContext<(user: User) => void>(() => {});

export const useUser = () => React.useContext(UserStateContext);
export const useSetUser = () => React.useContext(UserDispatchContext);

export const UserProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = React.useState(() => {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    return { username, token };
  });

  React.useEffect(() => {
    localStorage.setItem('username', user.username || '');
    localStorage.setItem('token', user.token || '');
  }, [user]);

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
