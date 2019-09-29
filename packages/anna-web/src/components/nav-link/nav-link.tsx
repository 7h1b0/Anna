import React from 'react';
import { Link, LinkGetProps } from '@reach/router';
import { css } from '@emotion/core';

import { colorAccent, colorTitle } from 'modules/theme';

const isActive = ({ isCurrent }: LinkGetProps): Object => {
  return isCurrent
    ? { style: { fill: colorAccent } }
    : { style: { fill: colorTitle } };
};

const BottomActions: React.FC<{ to: string }> = ({ to, children }) => {
  return (
    <Link
      to={to}
      getProps={isActive}
      css={css`
        transition: fill 0.3s ease-in-out;
        padding: 32px;
      `}
    >
      {children}
    </Link>
  );
};

export default BottomActions;
