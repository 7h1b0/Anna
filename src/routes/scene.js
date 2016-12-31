const Scene = require('./../models/scene');
const Action = require('./../utils/action');
const getJoiError = require('../utils/errorUtil');
const hueService = require('../services/hueService');

module.exports = (app) => {
  app.route('/api/scenes')
    .get((req, res) => {
      Scene.find({})
        .then(scenes => res.send(scenes))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      Scene.validate(req.body, (err, scene) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          const newScene = new Scene({
            name: scene.name,
            description: scene.description,
            actions: scene.actions,
          });

          newScene.save()
            .then(scene => res.status(201).send(scene))
            .catch(err => res.status(500).send({ err }));
        }
      });
    });

  app.route('/api/scenes/:id_scene([0-9a-z]{24})')
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
      Scene.validate(req.body, (err, scene) => {
        if (err) {
          res.status(400).send(getJoiError(err));
        } else {
          Scene.findByIdAndUpdate(req.params.id_scene, scene, { new: true })
            .then(scene => {
              if (!scene) {
                res.sendStatus(404);
              } else {
                res.send(scene);
              }
            })
            .catch(err => res.status(500).send({ err }));
        }
      });
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

  app.route('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})')
    .get((req, res) => {
      hueService.getScene(req.params.id_hue_scene)
        .then(light => res.send(light))
        .catch(err => res.status(500).send({ err }));
    })

    .delete((req, res) => {
      hueService.delete(req.params.id_hue_scene)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/scenes/:id_scene([0-9a-z]{24})/action', (req, res) => {
    Scene.findById(req.params.id_scene)
      .then(scene => {
        Action(scene.actions, hueService);
        res.end();
      })
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})/action', (req, res) => {
    hueService.recallScene(req.params.id_hue_scene)
      .then(() => res.end())
      .catch(err => res.status(500).send({ err }));
  });
};
