module.exports = {
  isValid({ name, date, actions }) {
    return new Promise((resolve, reject) => {
      if (name === undefined) {
        reject('Invalid name');
      } else if (date === undefined) {
        reject('Invalid date');
      } else if (actions === undefined) {
        reject('Invalid actions');
      } else {
        resolve();
      }
    });
  },
};
