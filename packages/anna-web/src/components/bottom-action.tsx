import React from 'react';
import { css } from '@emotion/core';

import NavLink from 'components/nav-link';

import {
  ScenesIcon,
  RoomsIcon,
  RoutinesIcon,
  TriggersIcon,
} from 'components/icons';

const BottomActions: React.FC<{}> = () => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        text-align: center;
        position: fixed;
        width: 100%;
        bottom: 0;
      `}
    >
      <NavLink to="/">
        <ScenesIcon />
      </NavLink>
      <NavLink to="/rooms">
        <RoomsIcon />
      </NavLink>
      <NavLink to="/routines">
        <RoutinesIcon />
      </NavLink>
      <NavLink to="/triggers">
        <TriggersIcon />
      </NavLink>
    </div>
  );
};

export default BottomActions;
