import React from 'react';

import AuthenticateApp from './authenticated-app';
import Login from 'pages/login';
import { useUser } from 'context/user-context';

const App = () => {
  const user = useUser();
  return user && user.token ? <AuthenticateApp /> : <Login />;
};

export default App;
