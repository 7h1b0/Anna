module.exports = {
  returnFirst(sql) {
    return sql.then(result => result[0]);
  },
};
