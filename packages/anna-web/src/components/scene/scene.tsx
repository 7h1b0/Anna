import React from 'react';
import { css } from '@emotion/core';

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
  sceneId: string;
  name: string;
  description: string;
}> = ({ sceneId, name, description }) => {
  return (
    <div
      css={css`
        padding: ${spaceM};
        background: ${colorPrimary};
        box-shadow: 0 1px 7px rgba(0, 0, 0, 0.05);
        border-radius: ${borderRadius};
      `}
      role="button"
      onClick={() => console.log(sceneId)}
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
        {description}
      </p>
    </div>
  );
};

export default Scene;
