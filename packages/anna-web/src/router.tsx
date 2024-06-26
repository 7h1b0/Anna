import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login, { actionLogin } from '@/pages/login';
import Register, { actionRegister } from '@/pages/register';
import Layout, { loaderLayout } from '@/pages/layout';
import Home, { loaderHome } from '@/pages/home';
import Routines, { loaderRoutines } from '@/pages/routines';
import Triggers, { loaderTriggers } from '@/pages/triggers';
import { loaderLogout } from '@/pages/logout';
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
    path: '/register',
    element: <Register />,
    action: actionRegister,
  },
  {
    path: '/login',
    element: <Login />,
    action: actionLogin,
  },
  {
    element: <Layout />,
    loader: loaderLayout,
    children: [
      {
        path: '/home/rooms/light/:lightId',
        element: <HueLight />,
        loader: loaderHueLight,
      },
      {
        path: '/home/rooms/add',
        element: <RoomAdd />,
      },
      {
        id: 'room',
        path: '/home/rooms/:roomId',
        loader: loaderRoom,
        children: [
          {
            path: 'edit',
            element: <RoomEdit />,
          },
          {
            path: '/home/rooms/:roomId',
            element: <Room />,
          },
        ],
      },
      {
        path: '/home/dios/add',
        element: <DioAdd />,
        loader: loaderDioAdd,
      },
      {
        path: '/home/lights/add',
        element: <HueLightRoomAdd />,
        loader: loaderLightAdd,
      },
      {
        path: '/routines/add',
        element: <RoutineAdd />,
        loader: loaderScenes,
      },
      {
        path: '/routines/:routineId',
        element: <RoutineEdit />,
        loader: loaderRoutineEdit,
      },
      {
        path: '/routines',
        element: <Routines />,
        loader: loaderRoutines,
      },
      {
        path: '/triggers/add',
        element: <TriggerAdd />,
        loader: loaderScenes,
      },
      {
        path: '/triggers/:triggerId',
        element: <TriggerEdit />,
        loader: loaderTriggerEdit,
      },
      {
        path: '/triggers',
        element: <Triggers />,
        loader: loaderTriggers,
      },
      {
        id: 'scenes',
        path: '/scenes',
        element: <Scenes />,
        loader: loaderScenes,
      },
      {
        path: '/logout',
        loader: loaderLogout,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/',
        element: <Home />,
        loader: loaderHome,
      },
    ],
  },
]);
