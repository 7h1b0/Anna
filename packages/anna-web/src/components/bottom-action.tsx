import React from 'react';

import NavLink from 'components/nav-link';

import {
  ScenesIcon,
  RoomsIcon,
  RoutinesIcon,
  TriggersIcon,
} from 'components/icons';

const BottomActions: React.FC<{}> = () => {
  return (
    <div className="border-t-2 border-gray-700 flex xl:flex-col justify-around items-center ">
      <NavLink to="/">
        <ScenesIcon />
      </NavLink>
      <NavLink to="/rooms">
        <RoomsIcon />
      </NavLink>
      <NavLink to="/routines">
        <RoutinesIcon />
      </NavLink>
      <NavLink to="/triggers">
        <TriggersIcon />
      </NavLink>
    </div>
  );
};

export default BottomActions;
