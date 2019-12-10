const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.tsx', './public/index.html'],

  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});
const cssnano = require('cssnano')({
  preset: [
    'default',
    {
      discardComments: {
        removeAll: true,
      },
    },
  ],
});
const tailwindcss = require('tailwindcss')('./tailwindcss-config.js');

module.exports = {
  plugins: [
    tailwindcss,
    ...(process.env.NODE_ENV === 'production' ? [purgecss, cssnano] : []),
  ],
};
