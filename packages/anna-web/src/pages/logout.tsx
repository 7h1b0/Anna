import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useSetUser } from 'context/user-context';

function Logout() {
  const setUser = useSetUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    setUser({ username: null, token: null, isAway: false });
    navigate('/');
  }, []);

  return null;
}

export default Logout;
