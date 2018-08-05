const routes = require('express').Router();
const Scene = require('../modules/models/scene');
const { callScene } = require('../modules/actions');
const dispatch = require('../modules/dispatch');
const logger = require('../modules/logger');

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
      return res.sendStatus(400);
    }

    const userId = res.locals.user.userId;
    Scene.save({ ...req.body, userId })
      .then(sceneId => res.status(201).json({ ...req.body, sceneId }))
      .catch(err => res.status(500).send({ err }));
  });

routes
  .route('/api/scenes/:id_scene([0-9]+)')
  .get((req, res) => {
    Scene.findById(req.params.id_scene)
      .then(scene => {
        if (!scene) {
          res.sendStatus(404);
        } else {
          res.json(scene);
        }
      })
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    const isValid = Scene.validate(req.body);
    if (!isValid) {
      return res.sendStatus(400);
    }
    Scene.findByIdAndUpdate({ ...req.body, sceneId: req.params.id_scene })
      .then(rowsAffected => {
        if (!!rowsAffected) {
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      })
      .catch(err => res.status(500).send({ err }));
  })
  .delete((req, res) => {
    Scene.delete(req.params.id_scene)
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

routes.get('/api/scenes/:id_scene([0-9]+)/action', (req, res) => {
  dispatch(callScene(req.params.id_scene))
    .then(() => res.end())
    .catch(err => {
      logger.error(err);
      res.status(500).send({ err });
    });
});

module.exports = routes;
