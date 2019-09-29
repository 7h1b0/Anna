import React from 'react';
import { Router } from '@reach/router';

import BottomNavigation from 'components/bottom-action';
import { UserProvider } from 'src/context/user-context';

import Scenes from 'src/pages/scenes';
import Rooms from 'src/pages/rooms';
import Routines from 'src/pages/routines';
import Triggers from 'src/pages/triggers';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Scenes path="/" />
        <Rooms path="/rooms" />
        <Routines path="/routines" />
        <Triggers path="/triggers" />
      </Router>
      <BottomNavigation />
    </UserProvider>
  );
};

export default App;
