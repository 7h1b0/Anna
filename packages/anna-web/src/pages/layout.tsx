import React from 'react';
import { Outlet } from 'react-router';

import Navigation from '@/components/navigation';

function Layout() {
  return (
    <div className="h-full bg-gray-900 pb-16">
      <main className="relative flex-1 px-2 xl:px-4 max-w-1200 overflow-y-auto mx-auto">
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
}

export default Layout;

export const loaderLayout = async () => {
  console.log('YOLO LOADER');
  // const { isAway, username } = await fetch('/api/user', {
  //   method: 'GET',
  // }).then((res) => res.json());

  console.log('YOLO NOP');

  return { username: 'Anna', isAway: false };
};
