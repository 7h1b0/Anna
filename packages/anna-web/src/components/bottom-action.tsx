import React from 'react';

import NavLink from 'components/nav-link';

import {
  HomeIcon,
  RoutinesIcon,
  TriggersIcon,
  PowerIcon,
} from 'components/icons';

const BottomActions: React.FC<{}> = () => {
  const className = 'w-5 mx-auto';
  return (
    <div className="shadow flex xl:flex-col justify-around xl:justify-center items-center bg-black">
      <NavLink ariaLabel="Navigate to Home" to="/">
        <HomeIcon className={className} />
      </NavLink>
      <NavLink ariaLabel="Navigate to Routines" to="/routines">
        <RoutinesIcon className={className} />
      </NavLink>
      <NavLink ariaLabel="Navigate to Triggers" to="/triggers">
        <TriggersIcon className={className} />
      </NavLink>
      <NavLink ariaLabel="Navigate to Consumption" to="/consumption">
        <PowerIcon className={className} />
      </NavLink>
    </div>
  );
};

export default BottomActions;
