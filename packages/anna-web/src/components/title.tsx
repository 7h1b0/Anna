import React from 'react';

const Title: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h1 className="text-2xl text-white tracking-wide leading-none mb-8">
      {title}
    </h1>
  );
};

export default Title;
