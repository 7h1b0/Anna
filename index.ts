import app from './src';
import { info } from './src/modules/logger';
import { PORT } from './src/constants';

app.listen(PORT, () => {
  info(`Anna is listening on port ${PORT}`);
});
