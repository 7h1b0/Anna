import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';

type Props = {
  to: string;
  title: string;
};

function NavLink({ to, children, title }: React.PropsWithChildren<Props>) {
  return (
    <li className="flex-1 xl:flex-initial ">
      <RRNavLink
        to={to}
        className={({ isActive }) => {
          const activeClass = isActive ? 'text-teal-500' : 'text-white';
          return `focus:outline-none flex xl:items-center xl:gap-4 fill-current p-5 ${activeClass} hover:text-teal-500`;
        }}
      >
        {children}
        <span className="hidden xl:block">{title}</span>
      </RRNavLink>
    </li>
  );
}

export default NavLink;
