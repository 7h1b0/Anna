import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import BottomNavigation from 'components/bottom-action';

import Scenes from 'src/pages/scenes';
import Rooms from 'src/pages/rooms';
import Routines from 'src/pages/routines';
import Triggers from 'src/pages/triggers';
import Devices from 'src/pages/devices';

const AuthenticateApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/rooms/:roomId">
          <Devices />
        </Route>
        <Route path="/rooms">
          <Rooms />
        </Route>
        <Route path="/routines">
          <Routines />
        </Route>
        <Route path="/triggers">
          <Triggers />
        </Route>
        <Route path="/">
          <Scenes />
        </Route>
      </Switch>
      <BottomNavigation />
    </Router>
  );
};

export default AuthenticateApp;
