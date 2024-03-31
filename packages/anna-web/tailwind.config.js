import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    container: false,
    opacity: false,
    borderOpacity: false,
    backgroundOpacity: false,
    textOpacity: false,
    ringOpacity: false,
  },
  content: ['./src/**/*.html', './src/**/*.tsx'],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '.75rem',
      full: '9999px',
    },
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
