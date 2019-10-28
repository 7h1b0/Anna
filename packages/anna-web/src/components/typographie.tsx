import React from 'react';
import { css } from '@emotion/core';

import {
  sizeText,
  sizeLabel,
  sizeHeadline,
  colorTitle,
  colorSubtitle,
} from 'modules/theme';

const mappingVariant = {
  heading: {
    color: colorTitle,
    size: sizeHeadline,
  },
  body: {
    color: colorTitle,
    size: sizeText,
  },
  caption: {
    color: colorSubtitle,
    size: sizeLabel,
  },
};

const Typographie: React.FC<{
  variant?: 'heading' | 'body' | 'caption';
}> = ({ variant = 'body', children }) => {
  const theme = mappingVariant[variant];
  return (
    <p
      css={css`
        color: ${theme.color};
        font-size: ${theme.size};
      `}
    >
      {children}
    </p>
  );
};

export default Typographie;
