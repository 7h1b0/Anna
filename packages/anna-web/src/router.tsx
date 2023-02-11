import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Login, { actionLogin } from 'pages/login';
import Register, { actionRegister } from 'pages/register';
import Layout, { loaderLayout } from 'pages/layout';
import Home from 'pages/home';
import Routines from 'pages/routines';
import Triggers from 'pages/triggers';
import Logout, { loaderLogout } from 'pages/logout';
import Settings from 'pages/settings';
import HueLight from 'pages/hue-light';
import Room from 'pages/room';
import RoomAdd from 'pages/room-add';
import RoomEdit from 'pages/room-edit';
import DioAdd from 'pages/dio-add';
import Scenes from 'pages/scenes';
import TriggerEdit from 'pages/trigger-edit';
import TriggerAdd from 'pages/trigger-add';
import RoutineEdit from 'pages/routine-edit';
import RoutineAdd from 'pages/routine-add';
import HueLightRoomAdd from 'pages/hue-light-room-add';

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
    id: 'me',
    loader: loaderLayout,
    children: [
      {
        path: '/home/rooms/light/:lightId',
        element: <HueLight />,
      },
      {
        path: '/home/rooms/:roomId/edit',
        element: <RoomEdit />,
      },
      {
        path: '/home/rooms/add',
        element: <RoomAdd />,
      },
      {
        path: '/home/rooms/:roomId',
        element: <Room />,
      },
      {
        path: '/home/dios/add',
        element: <DioAdd />,
      },
      {
        path: '/home/lights/add',
        element: <HueLightRoomAdd />,
      },
      {
        path: '/routines/add',
        element: <RoutineAdd />,
      },
      {
        path: '/routines/:routineId',
        element: <RoutineEdit />,
      },
      {
        path: '/routines',
        element: <Routines />,
      },
      {
        path: '/triggers/add',
        element: <TriggerAdd />,
      },
      {
        path: '/triggers/:triggerId',
        element: <TriggerEdit />,
      },
      {
        path: '/triggers',
        element: <Triggers />,
      },
      {
        path: '/scenes',
        element: <Scenes />,
      },
      {
        path: '/logout',
        loader: loaderLogout,
        element: <Logout />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/',
        element: <Home />,
      },
    ],
  },
]);
