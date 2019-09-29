import React from 'react';
import { css } from '@emotion/core';

import { formatDate } from 'modules/format';

import {
  colorPrimary,
  sizeText,
  sizeLabel,
  spaceM,
  borderRadius,
  colorTitle,
  colorSubtitle,
} from 'modules/theme';

const Scene: React.FC<{
  routineId: string;
  name: string;
  lastRunAt: number;
}> = ({ routineId, name, lastRunAt }) => {
  return (
    <div
      css={css`
        padding: ${spaceM};
        background: ${colorPrimary};
        box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);
        border-radius: ${borderRadius};
      `}
      role="button"
      onClick={() => console.log(routineId)}
    >
      <p
        css={css`
          color: ${colorTitle};
          font-size: ${sizeText};
        `}
      >
        {name}
      </p>
      <p
        css={css`
          color: ${colorSubtitle};
          font-size: ${sizeLabel};
        `}
      >
        {formatDate(lastRunAt)}
      </p>
    </div>
  );
};

export default Scene;
