import React from 'react';

import NavLink from '@/components/nav-link';

import {
  HomeIcon,
  RoutinesIcon,
  TriggersIcon,
  ScenesIcon,
} from '@/components/icons';

function Navigation() {
  const className = 'w-5 mx-auto';
  return (
    <nav className="fixed bottom-2 bg-gray-800 rounded inset-x-2">
      <ul
        className="list-none flex items-center  justify-center xl:items-start"
        style={{ height: 'inherit' }}
      >
        <NavLink to="/" title="Dashboard">
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
