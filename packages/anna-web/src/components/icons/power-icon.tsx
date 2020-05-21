import React from 'react';
import { IconProps } from './IconProps';

const PowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    className={className}
  >
    <path d="M13 8V0L8.11 5.87 3 12h4v8L17 8h-4z" />
  </svg>
);

export default PowerIcon;
