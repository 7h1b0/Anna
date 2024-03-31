import React from 'react';
import { Outlet } from 'react-router-dom';

import Navigation from 'components/navigation';

function Layout() {
  return (
    <div className="h-full flex justify-end flex-col xl:flex-row-reverse bg-gray-900">
      <main className="relative flex-1 px-2 xl:px-4 max-w-1200 overflow-y-auto">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}

export default Layout;

export const loaderLayout = async () => {
  const { isAway } = await fetch('/api/config', {
    method: 'GET',
  }).then((res) => res.json());

  return { isAway };
};
