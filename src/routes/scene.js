const Scene = require('../modules/models/scene');
const { callScene } = require('../modules/actions');
const dispatch = require('../modules/dispatch');
const hueService = require('../services/hueService');
const logger = require('../modules/logger');

module.exports = app => {
  app
    .route('/api/scenes')
    .get((req, res) => {
      Scene.findAll()
        .then(scenes => res.send(scenes))
        .catch(err => res.status(500).send({ err }));
    })
    .post((req, res) => {
      const isValid = Scene.validate(req.body);
      if (!isValid) {
        return res.sendStatus(400);
      }
      const { name, description, actions } = req.body;
      const newScene = new Scene({
        name,
        description,
        actions,
      });

      Scene.save(newScene)
        .then(() => res.status(201).send(newScene))
        .catch(err => res.status(500).send({ err }));
    });

  app
    .route('/api/scenes/:id_scene([0-9]+)')
    .get((req, res) => {
      Scene.findById(req.params.id_scene)
        .then(scene => {
          if (!scene) {
            res.sendStatus(404);
          } else {
            res.send(scene);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })
    .patch((req, res) => {
      const isValid = Scene.validate(req.body);
      if (!isValid) {
        return res.sendStatus(400);
      }
      Scene.findByIdAndUpdate(req.params.id_scene, req.body, { new: true })
        .then(rowsAffected => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })
    .delete((req, res) => {
      Scene.findByIdAndRemove(req.params.id_scene)
        .then(scene => {
          if (!scene) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/scenes/:id_scene([0-9]+)/action', (req, res) => {
    dispatch(callScene(req.params.id_scene))
      .then(() => res.end())
      .catch(err => {
        logger.error(err);
        res.status(500).send({ err });
      });
  });
};
