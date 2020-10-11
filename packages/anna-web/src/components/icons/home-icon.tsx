import React from 'react';
import { IconProps } from './IconProps';

const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className={className}
  >
    <path d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
  </svg>
);

export default HomeIcon;
