import React from 'react';
import { Redirect } from 'react-router-dom';

import { useSetUser } from 'context/user-context';

function Logout() {
  const setUser = useSetUser();
  setUser({ username: null, token: null });

  return <Redirect to="/" />;
}

export default Logout;
