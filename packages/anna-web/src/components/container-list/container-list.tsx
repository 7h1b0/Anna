import React from 'react';
import { css } from '@emotion/core';

import { spaceM } from 'modules/theme';

const ContainerList: React.FC<{ column?: number }> = ({
  column = 2,
  children,
}) => {
  const templaceColumns = Array.from({ length: column })
    .map(() => '1fr')
    .join(' ');
  console.log(templaceColumns);
  return (
    <div
      css={css`
        display: grid;
        margin: ${spaceM};
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

export default ContainerList;
