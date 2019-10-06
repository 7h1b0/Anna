import React from 'react';
import { css } from '@emotion/core';

import { colorPrimary, spaceM } from 'modules/theme';

const Card: React.FC<{
  role?: 'button';
  onClick?: () => void;
}> = ({ children, role, onClick }) => {
  return (
    <div
      css={css`
        padding: ${spaceM};
        background: ${colorPrimary};
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
          0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 2px 1px -1px rgba(0, 0, 0, 0.12);
      `}
      role={role}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
