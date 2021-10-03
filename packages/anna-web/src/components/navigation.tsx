import React from 'react';

import NavLink from 'components/nav-link';

import {
  HomeIcon,
  RoutinesIcon,
  TriggersIcon,
  ScenesIcon,
} from 'components/icons';

function Navigation() {
  const className = 'w-5 mx-auto';
  return (
    <nav className="bg-black shadow xl:h-full">
      <ul
        className="list-none flex items-center  justify-around xl:justify-center xl:flex-col xl:items-start xl:w-64"
        style={{ height: 'inherit' }}
      >
        <NavLink to="/home" title="Dashboard">
          <HomeIcon className={className} />
        </NavLink>
        <NavLink to="/scenes" title="Scenes">
          <ScenesIcon className={className} />
        </NavLink>
        <NavLink to="/routines" title="Routines">
          <RoutinesIcon className={className} />
        </NavLink>
        <NavLink to="/triggers" title="Triggers">
          <TriggersIcon className={className} />
        </NavLink>
      </ul>
    </nav>
  );
}

export default Navigation;
