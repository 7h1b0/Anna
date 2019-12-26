import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import BottomNavigation from 'components/bottom-action';

import Header from 'src/components/header';
import Scenes from 'src/pages/scenes';
import Rooms from 'src/pages/rooms';
import Routines from 'src/pages/routines';
import Triggers from 'src/pages/triggers';
import Logout from 'src/pages/logout';
import Settings from 'src/pages/settings';
import Devices from 'src/pages/devices';
import TriggerEdit from 'src/pages/trigger-edit';

const AuthenticateApp = () => {
  return (
    <Router>
      <div className="h-full flex justify-end flex-col xl:flex-row-reverse bg-black xl:bg-gray-900">
        <div className="flex-1 px-4 rounded-b-xl xl:rounded-none bg-gray-900 max-w-1440">
          <Header />
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
            <Route path="/triggers/:triggerId">
              <TriggerEdit />
            </Route>
            <Route path="/triggers">
              <Triggers />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/settings">
              <Settings />
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
