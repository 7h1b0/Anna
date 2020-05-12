import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import BottomNavigation from 'components/bottom-action';

import Home from 'src/pages/home';
import Routines from 'src/pages/routines';
import Triggers from 'src/pages/triggers';
import Logout from 'src/pages/logout';
import Settings from 'src/pages/settings';
import HueLight from 'src/pages/hue-light';
import Room from 'src/pages/room';
import TriggerEdit from 'src/pages/trigger-edit';
import RoutineEdit from 'src/pages/routine-edit';

const AuthenticateApp = () => {
  return (
    <Router>
      <div className="h-full flex justify-end flex-col xl:flex-row-reverse bg-gray-900">
        <div className="flex-1 px-2 max-w-1440 overflow-y-auto">
          <Switch>
            <Route path="/rooms/light/:lightId">
              <HueLight />
            </Route>
            <Route path="/rooms/:roomId">
              <Room />
            </Route>
            <Route path="/routines/:routineId">
              <RoutineEdit />
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
              <Home />
            </Route>
          </Switch>
        </div>
        <BottomNavigation />
      </div>
    </Router>
  );
};

export default AuthenticateApp;
