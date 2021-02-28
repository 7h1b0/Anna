import React from 'react';

type Variant = 'heading' | 'body' | 'caption' | 'head' | 'label';
const getClassName = (variant: Variant): string => {
  switch (variant) {
    case 'head':
      return 'text-base text-3xl text-teal-500';
    case 'heading':
      return 'text-base text-white';
    case 'body':
      return 'text-sm text-white';
    case 'caption':
      return 'text-xs text-gray-300';
    case 'label':
      return 'text-gray-400 text-xs font-bold uppercase';
  }
};

const Typography: React.FC<{
  variant?: Variant;
  className?: string;
}> = ({ className = '', variant = 'body', children }) => {
  return <p className={`${getClassName(variant)} ${className}`}>{children}</p>;
};

export default Typography;
