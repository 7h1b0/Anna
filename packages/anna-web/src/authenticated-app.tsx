import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import BottomNavigation from 'components/bottom-action';

import Scenes from 'src/pages/scenes';
import Rooms from 'src/pages/rooms';
import Routines from 'src/pages/routines';
import Triggers from 'src/pages/triggers';
import Logout from 'src/pages/logout';
import Devices from 'src/pages/devices';

const AuthenticateApp = () => {
  return (
    <Router>
      <div className="flex flex-col xl:flex-row-reverse h-full max-w-1440">
        <div className="flex-1 p-4">
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
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/">
              <Scenes />
            </Route>
          </Switch>
        </div>
        <BottomNavigation />
      </div>
    </Router>
  );
};

export default AuthenticateApp;
