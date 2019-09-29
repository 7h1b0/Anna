import app from './src';
import { info } from './src/modules/logger';

const PORT = process.env.PORT || 8181;
app.listen(PORT, () => {
  info(`Anna is listening on port ${PORT}`);
});
