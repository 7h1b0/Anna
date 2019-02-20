import { Router } from 'express';
import * as Scene from 'modules/models/scene';
import { callScene } from 'modules/actions';
import dispatch from 'modules/dispatch';
import * as logger from 'modules/logger';

const routes = Router();
routes
  .route('/api/scenes')
  .get((req, res) => {
    Scene.findAll()
      .then(scenes => res.json(scenes))
      .catch(err => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Scene.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const userId = res.locals.user.userId;
      Scene.save({ ...req.body, userId })
        .then(sceneId => res.status(201).json({ sceneId }))
        .catch(err => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/scenes/:sceneId([a-fA-F0-9-]{36})')
  .get((req, res) => {
    Scene.findById(req.params.sceneId)
      .then(scene => {
        if (!scene) {
          res.sendStatus(404);
        } else {
          res.json(scene);
        }
      })
      .catch(err => {
        res.status(500).send({ err });
      });
  })
  .patch((req, res) => {
    const isValid = Scene.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      Scene.findByIdAndUpdate({ ...req.body, sceneId: req.params.sceneId })
        .then(rowsAffected => {
          if (!!rowsAffected) {
            res.sendStatus(204);
          } else {
            res.sendStatus(404);
          }
        })
        .catch(err => res.status(500).send({ err }));
    }
  })
  .delete((req, res) => {
    Scene.remove(req.params.sceneId)
      .then(([removedScene]) => {
        if (removedScene < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch(err => {
        res.status(500).send({ err });
      });
  });

routes.get('/api/scenes/:sceneId([a-fA-F0-9-]{36})/action', (req, res) => {
  dispatch(callScene(req.params.sceneId))
    .then(() => res.end())
    .catch(err => {
      logger.error(err);
      res.status(500).send({ err });
    });
});

export default routes;
