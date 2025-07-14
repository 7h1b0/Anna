import { createBrowserRouter } from 'react-router';

import Layout, { loaderLayout } from '@/pages/layout';
import Home, { loaderHome } from '@/pages/home';
import Routines, { loaderRoutines } from '@/pages/routines';
import Triggers, { loaderTriggers } from '@/pages/triggers';
import Settings from '@/pages/settings';
import HueLight, { loaderHueLight } from '@/pages/hue-light';
import Room, { loaderRoom } from '@/pages/room';
import RoomAdd from '@/pages/room-add';
import RoomEdit from '@/pages/room-edit';
import DioAdd, { loaderDioAdd } from '@/pages/dio-add';
import Scenes, { loaderScenes } from '@/pages/scenes';
import TriggerEdit, { loaderTriggerEdit } from '@/pages/trigger-edit';
import TriggerAdd from '@/pages/trigger-add';
import RoutineEdit, { loaderRoutineEdit } from '@/pages/routine-edit';
import RoutineAdd from '@/pages/routine-add';
import HueLightRoomAdd, { loaderLightAdd } from '@/pages/hue-light-room-add';

export const router = createBrowserRouter([
  {
    Component: Layout,
    loader: loaderLayout,
    children: [
      {
        path: '/home/rooms/light/:lightId',
        Component: HueLight,
        loader: loaderHueLight,
      },
      {
        path: '/home/rooms/add',
        Component: RoomAdd,
      },
      {
        id: 'room',
        path: '/home/rooms/:roomId',
        loader: loaderRoom,
        children: [
          {
            path: 'edit',
            Component: RoomEdit,
          },
          {
            path: '/home/rooms/:roomId',
            Component: Room,
          },
        ],
      },
      {
        path: '/home/dios/add',
        Component: DioAdd,
        loader: loaderDioAdd,
      },
      {
        path: '/home/lights/add',
        Component: HueLightRoomAdd,
        loader: loaderLightAdd,
      },
      {
        path: '/routines/add',
        Component: RoutineAdd,
        loader: loaderScenes,
      },
      {
        path: '/routines/:routineId',
        Component: RoutineEdit,
        loader: loaderRoutineEdit,
      },
      {
        path: '/routines',
        Component: Routines,
        loader: loaderRoutines,
      },
      {
        path: '/triggers/add',
        Component: TriggerAdd,
        loader: loaderScenes,
      },
      {
        path: '/triggers/:triggerId',
        Component: TriggerEdit,
        loader: loaderTriggerEdit,
      },
      {
        path: '/triggers',
        Component: Triggers,
        loader: loaderTriggers,
      },
      {
        id: 'scenes',
        path: '/scenes',
        Component: Scenes,
        loader: loaderScenes,
      },
      {
        path: '/settings',
        Component: Settings,
      },
      {
        path: '/',
        Component: Home,
        loader: loaderHome,
      },
    ],
  },
]);
