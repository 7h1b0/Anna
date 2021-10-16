import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
          <Routes>
            <Route path="/home/rooms/light/:lightId" element={<HueLight />} />
            <Route path="/home/rooms/:roomId/edit" element={<RoomEdit />} />
            <Route path="/home/rooms/add" element={<RoomAdd />} />
            <Route path="/home/rooms/:roomId" element={<Room />} />
            <Route path="/home/dios/add" element={<DioAdd />} />
            <Route path="/home/lights/add" element={<HueLightRoomAdd />} />
            <Route path="/routines/add" element={<RoutineAdd />} />
            <Route path="/routines/:routineId" element={<RoutineEdit />} />
            <Route path="/routines" element={<Routines />} />
            <Route path="/triggers/add" element={<TriggerAdd />} />
            <Route path="/triggers/:triggerId" element={<TriggerEdit />} />
            <Route path="/triggers" element={<Triggers />} />
            <Route path="/scenes" element={<Scenes />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  );
}

export default AuthenticateApp;
