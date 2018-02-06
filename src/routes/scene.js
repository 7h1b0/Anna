const Scene = require('../models/scene');
const { callScene } = require('../modules/actions');
const dispatch = require('../modules/dispatch');
const hueService = require('../services/hueService');
const logger = require('../modules/logger');

module.exports = app => {
  app
    .route('/api/scenes')
    .get((req, res) => {
      Scene.find({})
        .then(scenes => res.send(scenes))
        .catch(err => res.status(500).send({ err }));
    })
    .post((req, res) => {
      const isValid = Scene.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        const { name, description, actions } = req.body;
        const newScene = new Scene({
          name,
          description,
          actions,
        });

        newScene
          .save()
          .then(scene => res.status(201).send(scene))
          .catch(err => res.status(500).send({ err }));
      }
    });

  app
    .route('/api/scenes/:id_scene([0-9a-z]{24})')
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
    .put((req, res) => {
      const isValid = Scene.validate(req.body);
      if (!isValid) {
        res.sendStatus(400);
      } else {
        Scene.findByIdAndUpdate(req.params.id_scene, req.body, { new: true })
          .then(scene => {
            if (!scene) {
              res.sendStatus(404);
            } else {
              res.send(scene);
            }
          })
          .catch(err => res.status(500).send({ err }));
      }
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

  app
    .route('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})')
    .get((req, res) => {
      hueService
        .getScene(req.params.id_hue_scene)
        .then(light => res.send(light))
        .catch(err => res.status(500).send({ err }));
    })
    .delete((req, res) => {
      hueService
        .delete(req.params.id_hue_scene)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/scenes/:id_scene([0-9a-z]{24})/action', (req, res) => {
    dispatch(callScene(req.params.id_scene))
      .then(() => res.end())
      .catch(err => {
        logger.error(err);
        res.status(500).send({ err });
      });
  });

  app.get('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})/action', (req, res) => {
    hueService
      .recallScene(req.params.id_hue_scene)
      .then(() => res.end())
      .catch(err => {
        logger.error(err);
        res.status(500).send({ err });
      });
  });
};
