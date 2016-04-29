// Dependencies
let app = require("express")();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');
const logMiddleware = require('./api/middlewares/logMiddlewares');
const requireAuthentification = require('./api/middlewares/authentificationMiddlewares');
const log = require('./api/routes/log');
const about = require('./api/routes/about');
const scene = require('./api/routes/scene');
const timer = require('./api/routes/timer');
const dio = require('./api/routes/dio');
const hueLight = require('./api/routes/hueLight');
const hueSchedules = require('./api/routes/hueSchedules');
const user = require('./api/routes/user');
const HueService = require('./api/services/hueService');

// Setup Database
const uri = `mongodb://${config.database.hostname}:${config.database.port}/${config.database.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(uri);

// Setup Hue Service
const hueService = new HueService(config.hue.hostname, config.hue.username);

// Setup Server
app.use(bodyParser.json());
app.listen(config.port);

// API
app.all('/api/*', requireAuthentification, logMiddleware);
user(app);
log(app);
scene(app, hueService, config);
timer(app, config);
dio(app);
hueLight(app, hueService);
hueSchedules(app, hueService);
about(app, config);

// Default Controller
app.use((req, res) => res.sendStatus(404));

