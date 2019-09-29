module.exports = api => {
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
      [
        '@emotion/babel-preset-css-prop',
        {
          autoLabel: false,
        },
      ],
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
  };
};
