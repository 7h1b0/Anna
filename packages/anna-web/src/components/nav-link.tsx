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
  title: string;
};

function NavLink({ to, children, title }: React.PropsWithChildren<Props>) {
  const match = useRouteMatch(to);
  const activeClass = isActive(match) ? 'text-teal-500' : 'text-white';

  return (
    <li className="flex-1 xl:flex-initial">
      <Link
        to={to}
        className={`xl:flex xl:items-center xl:gap-4 fill-current px-4 py-5 ${activeClass}`}
      >
        {children}
        <span className="hidden xl:block">{title}</span>
      </Link>
    </li>
  );
}

export default NavLink;
