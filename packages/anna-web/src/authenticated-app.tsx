import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import Navigation from 'components/navigation';

import Home from 'src/pages/home';
import Routines from 'src/pages/routines';
import Triggers from 'src/pages/triggers';
import Logout from 'src/pages/logout';
import Settings from 'src/pages/settings';
import HueLight from 'src/pages/hue-light';
import Room from 'src/pages/room';
import RoomAdd from 'src/pages/room-add';
import RoomEdit from 'src/pages/room-edit';
import DioAdd from 'src/pages/dio-add';
import Scenes from 'src/pages/scenes';
import TriggerEdit from 'src/pages/trigger-edit';
import TriggerAdd from 'src/pages/trigger-add';
import RoutineEdit from 'src/pages/routine-edit';
import RoutineAdd from 'src/pages/routine-add';
import HueLightRoomAdd from 'src/pages/hue-light-room-add';

function AuthenticateApp() {
  return (
    <Router>
      <div className="h-full flex justify-end flex-col xl:flex-row-reverse bg-gray-900">
        <main className="relative flex-1 px-2 xl:px-4 max-w-1200 overflow-y-auto">
          <Switch>
            <Route path="/home/rooms/light/:lightId">
              <HueLight />
            </Route>
            <Route path="/home/rooms/:roomId/edit">
              <RoomEdit />
            </Route>
            <Route path="/home/rooms/add">
              <RoomAdd />
            </Route>
            <Route path="/home/rooms/:roomId">
              <Room />
            </Route>
            <Route path="/home/dios/add">
              <DioAdd />
            </Route>
            <Route path="/home/lights/add">
              <HueLightRoomAdd />
            </Route>
            <Route path="/routines/add">
              <RoutineAdd />
            </Route>
            <Route path="/routines/:routineId">
              <RoutineEdit />
            </Route>
            <Route path="/routines">
              <Routines />
            </Route>
            <Route path="/triggers/add">
              <TriggerAdd />
            </Route>
            <Route path="/triggers/:triggerId">
              <TriggerEdit />
            </Route>
            <Route path="/triggers">
              <Triggers />
            </Route>
            <Route path="/scenes">
              <Scenes />
            </Route>
            <Route path="/logout">
              <Logout />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route path="/home">
              <Home />
            </Route>
            <Redirect to="/home" />
          </Switch>
        </main>
        <Navigation />
      </div>
    </Router>
  );
}

export default AuthenticateApp;
