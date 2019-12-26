import React from 'react';

import NavLink from 'components/nav-link';

import {
  ScenesIcon,
  HomeIcon,
  RoutinesIcon,
  TriggersIcon,
} from 'components/icons';

const BottomActions: React.FC<{}> = () => {
  const className = 'w-5 mx-auto';
  return (
    <div className="shadow flex xl:flex-col justify-around xl:justify-center items-center bg-black">
      <NavLink to="/">
        <ScenesIcon className={className} />
      </NavLink>
      <NavLink to="/rooms">
        <HomeIcon className={className} />
      </NavLink>
      <NavLink to="/routines">
        <RoutinesIcon className={className} />
      </NavLink>
      <NavLink to="/triggers">
        <TriggersIcon className={className} />
      </NavLink>
    </div>
  );
};

export default BottomActions;
