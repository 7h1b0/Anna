import React from 'react';

type User = {
  token: string;
  username: string;
};

const UserStateContext = React.createContext<User | null>(null);
const UserDispatchContext = React.createContext<(user: User) => void>(() => {});

export const useUser = () => React.useContext(UserStateContext);
export const useSetUser = () => React.useContext(UserDispatchContext);

export const UserProvider: React.FC<{}> = ({ children }) => {
  const [user, setUser] = React.useState({
    username: 'Plop',
    token: '510393e316e37f2eb1e2b37739bdce5a1b21',
  });

  return (
    <UserStateContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};
