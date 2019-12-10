import React from 'react';

const Header: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <div>
      <h1 className="text-3xl text-white tracking-wide leading-none">
        {title}
      </h1>
      {subtitle && <h2 className="text-xl text-gray-300">{subtitle}</h2>}
    </div>
  );
};

export default Header;
