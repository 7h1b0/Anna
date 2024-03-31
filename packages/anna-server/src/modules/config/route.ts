import { Router } from 'express';
import * as Config from './model';

const routes = Router();

routes
  .route('/api/config/')
  .get((req, res) => {
    Config.fetchIsAway()
      .then((isAway) => res.json({ isAway }))
      .catch((err) => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    const isAway = req.body.isAway;

    if (isAway === undefined) {
      return res.sendStatus(400);
    }

    Config.updateIsAway(isAway)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err: Error) => res.status(500).send({ err }));
  });

export default routes;
