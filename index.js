import app from './src/index.js';
import { info } from './src/modules/logger';

const { PORT } = require('./src/constants');

app.listen(PORT, () => {
  info(`Anna is listening on port ${PORT}`);
});
