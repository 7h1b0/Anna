import React from 'react';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h1 className="text-2xl text-white tracking-wide leading-none my-8">
      {title}
    </h1>
  );
};

export default Header;
