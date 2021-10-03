const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.html', './src/**/*.tsx'],
  },
  theme: {
    extend: {
      maxWidth: {
        1200: '1200px',
      },
      colors: {
        teal: colors.teal,
      },
    },
  },
};
