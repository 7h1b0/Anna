import React from 'react';

type Variant = 'heading' | 'body' | 'caption';
const getClassName = (variant: Variant): string => {
  switch (variant) {
    case 'heading':
      return 'text-lg text-white';
    case 'body':
      return 'text-base text-gray-300';
    case 'caption':
      return 'text-xs text-gray-300';
  }
};

const Typographie: React.FC<{
  variant?: Variant;
}> = ({ variant = 'body', children }) => {
  return <p className={getClassName(variant)}>{children}</p>;
};

export default Typographie;
