module.exports = (err = []) => {
  if (err.details && Array.isArray(err.details)) {
    return err.details.map((detail) => detail.message);
  }
  return err;
};
