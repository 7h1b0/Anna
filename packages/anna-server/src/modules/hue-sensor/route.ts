import { Router } from 'express';
import * as hueService from 'services/hueService';
import * as hueSensor from 'modules/hue-sensor/model';

const routes = Router();

routes
  .route('/api/hue/sensors')
  .post((req, res) => {
    const isValid = hueSensor.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      hueSensor
        .insertOrUpdate(req.body.sensorId, req.body.roomId)
        .then(() => res.sendStatus(201))
        .catch((err) => res.status(500).send({ err }));
    }
  })
  .get((req, res) => {
    hueService
      .getSensors()
      .then((sensors) => res.json(sensors))
      .catch((err) => res.status(500).send({ err }));
  });

export default routes;
