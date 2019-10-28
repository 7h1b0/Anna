import React from 'react';
import { useRouteMatch, match } from 'react-router';
import { Link } from 'react-router-dom';
import { css } from '@emotion/core';

import { colorAccent, colorTitle } from 'modules/theme';

const isActive = (match: match | null) => {
  if (match === null) {
    return false;
  }
  if (match.isExact === false && match.url === '/') {
    return false;
  }
  return true;
};

const NavLink: React.FC<{ to: string }> = ({ to, children }) => {
  const match = useRouteMatch(to);

  const style = isActive(match) ? { fill: colorAccent } : { fill: colorTitle };
  return (
    <Link
      to={to}
      css={css`
        transition: fill 0.3s ease-in-out;
        padding: 32px;
      `}
      style={style}
    >
      {children}
    </Link>
  );
};

export default NavLink;
