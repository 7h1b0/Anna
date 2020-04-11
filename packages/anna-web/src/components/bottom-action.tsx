import React from 'react';

import NavLink from 'components/nav-link';

import {
  HomeIcon,
  RoutinesIcon,
  TriggersIcon,
  SettingsIcon,
} from 'components/icons';

const BottomActions: React.FC<{}> = () => {
  const className = 'w-5 mx-auto';
  return (
    <div className="shadow flex xl:flex-col justify-around xl:justify-center items-center xl:bg-black border-t-2 xl:border-t-0 border-gray-700">
      <NavLink to="/">
        <HomeIcon className={className} />
      </NavLink>
      <NavLink to="/routines">
        <RoutinesIcon className={className} />
      </NavLink>
      <NavLink to="/triggers">
        <TriggersIcon className={className} />
      </NavLink>
      <NavLink to="/settings">
        <SettingsIcon className={className} />
      </NavLink>
    </div>
  );
};

export default BottomActions;
