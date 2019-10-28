import React from 'react';
import { css } from '@emotion/core';
import {
  borderRadius,
  colorPrimary,
  colorTitle,
  colorSubtitle,
  spaceS,
  sizeLabel,
  sizeText,
} from 'modules/theme';

type Props = {
  autofocus?: boolean;
  name: string;
  label: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

const Input: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
}) => {
  return (
    <label
      htmlFor={name}
      css={css`
        color: ${colorSubtitle};
        font-size: ${sizeLabel};
      `}
    >
      {label}
      <input
        css={css`
          display: block;
          width: 100%;
          padding: ${spaceS};
          margin-top: 5px;
          border: 1px solid ${colorPrimary};
          background-color: ${colorPrimary};
          border-radius: ${borderRadius};
          color: ${colorTitle};
          font-size: ${sizeText};
          &:focus {
            outline: none;
          }
        `}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </label>
  );
};

export default Input;
