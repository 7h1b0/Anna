module.exports = {
  returnFirst(sql) {
    return sql.then(result => {
      if (!result.length) {
        return undefined;
      }
      return result[0];
    });
  },
};
