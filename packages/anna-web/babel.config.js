module.exports = (api) => {
  api.cache(true);
  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          targets: {
            chrome: 76,
          },
        },
      ],
    ],
    plugins: ['@babel/plugin-transform-react-jsx'],
  };
};
