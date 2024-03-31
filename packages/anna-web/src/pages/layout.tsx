import React from 'react';
import { Outlet, redirect } from 'react-router-dom';

import Navigation from '@/components/navigation';
import { getToken } from '@/utils';

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
  const token = getToken();

  if (!token) {
    return redirect('/login');
  }

  const headers: Record<string, string> = {
    'x-access-token': token ?? '',
  };
  const { isAway, username } = await fetch('/api/user', {
    method: 'GET',
    headers,
  }).then((res) => res.json());

  return { username, token, isAway };
};
