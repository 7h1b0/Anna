import app from './src/index.js';
import { info } from './src/modules/logger';
import { PORT } from './src/constants';

app.listen(PORT, () => {
  info(`Anna is listening on port ${PORT}`, true);
});
