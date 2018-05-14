const app = require('./src/index.js');
const logger = require('./src/modules/logger');

const { PORT } = require('./src/constants');

app.listen(PORT, () => {
  logger.info(`Anna is listening on port ${PORT}`);
});
