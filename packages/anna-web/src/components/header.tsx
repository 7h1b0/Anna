import React from 'react';
import { css } from '@emotion/core';

import {
  sizeLabel,
  colorTitle,
  sizeHeadline,
  spaceM,
  spaceL,
} from 'modules/theme';

const Header: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div
      css={css`
        padding: ${spaceL} ${spaceM};
        color: ${colorTitle};
      `}
    >
      <h1
        css={css`
          font-size: ${sizeHeadline};
        `}
      >
        {title}
      </h1>
      {subtitle && (
        <h2
          css={css`
            font-size: ${sizeLabel};
          `}
        >
          {subtitle}
        </h2>
      )}
    </div>
  );
};

export default Header;
