import React from 'react';

type Variant = 'heading' | 'body' | 'caption';
const getClassName = (variant: Variant): string => {
  switch (variant) {
    case 'heading':
      return 'text-base text-white';
    case 'body':
      return 'text-sm text-gray-300';
    case 'caption':
      return 'text-xs text-gray-300';
  }
};

const Typography: React.FC<{
  variant?: Variant;
  className?: string;
}> = ({ className = '', variant = 'body', children }) => {
  return <p className={`${getClassName(variant)} ${className}`}>{children}</p>;
};

export default Typography;