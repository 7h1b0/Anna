import React from 'react';
import { useRouteMatch, match } from 'react-router';
import { Link } from 'react-router-dom';

const isActive = (matchURL: match | null) => {
  if (matchURL === null) {
    return false;
  }
  if (matchURL.isExact === false && matchURL.url === '/') {
    return false;
  }
  return true;
};

type Props = {
  to: string;
};

function NavLink({ to, children }: React.PropsWithChildren<Props>) {
  const match = useRouteMatch(to);
  const activeClass = isActive(match) ? 'text-teal-500' : 'text-white';

  return (
    <Link
      to={to}
      className={`flex-1 xl:flex-initial fill-current px-4 py-5 ${activeClass}`}
    >
      {children}
    </Link>
  );
}

export default NavLink;
