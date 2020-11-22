const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.html', './src/**/*.tsx'],
  },
  theme: {
    extend: {
      maxWidth: {
        1440: '1440px',
      },
      colors: {
        teal: colors.teal,
      },
    },
  },
};
