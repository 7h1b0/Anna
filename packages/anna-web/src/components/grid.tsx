import React from 'react';
import { css } from '@emotion/core';

import { spaceM } from 'modules/theme';

const Grid: React.FC<{ column?: number; margin?: boolean }> = ({
  column = 2,
  margin = false,
  children,
}) => {
  const templaceColumns = Array.from({ length: column })
    .map(() => '1fr')
    .join(' ');
  return (
    <div
      css={css`
        display: grid;
        margin: ${margin ? spaceM : 0};
        grid-template-columns: ${templaceColumns};
        grid-template-rows: auto;
        grid-column-gap: ${spaceM};
        grid-row-gap: ${spaceM};
      `}
    >
      {children}
    </div>
  );
};

export default Grid;
