import { Router } from 'express';
import * as Consumption from './model';

const routes = Router();
routes.route('/api/consumption').get((req, res) => {
  Consumption.findLastWeek()
    .then((consumptions) => res.json(consumptions))
    .catch((err) => res.status(500).send({ err }));
});

export default routes;
