const Scene = require('./../models/scene');
const makeLocalRequest = require('./../helpers/makeLocalRequestHelper');

module.exports = (router, hueService, config) => {
  router.route('/api/scenes')
    .get((req, res) => {
      Promise.all([Scene.find({}), hueService.getScenes()])
        .then(data => res.send([...data[0], ...data[1]]))
        .catch(err => res.status(500).send(err));
    })

    .post((req, res) => {
      const badRequest = req.body.actions === undefined || req.body.name === undefined;

      if (badRequest) {
        res.sendStatus(400);
      } else {
        const newScene = new Scene({
          name: req.body.name,
          description: req.body.description,
          actions: req.body.actions,
        });

        newScene.save()
          .then(scene => res.status(201).send(scene))
          .catch(err => res.status(500).send(err));
      }
    });

  router.route('/api/scenes/:id_scene([0-9a-z]{24})')
    .get((req, res) => {
      Scene.findById(req.params.id_scene)
        .then(scene => {
          if (!scene) {
            res.sendStatus(404);
          } else {
            res.send(scene);
          }
        })
        .catch(err => res.status(500).send(err));
    })

    .put((req, res) => {
      Scene.findByIdAndUpdate(req.params.id_scene, req.body, { new: true })
        .then(scene => {
          if (!scene) {
            res.sendStatus(404);
          } else {
            res.send(scene);
          }
        })
        .catch(err => res.status(500).send(err));
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
        .catch(err => res.status(500).send(err));
    });

  router.route('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})')
    .get((req, res) => {
      hueService.getScene(req.params.id_hue_scene)
        .then(light => res.send(light))
        .catch(err => res.status(500).send(err));
    })

    .delete((req, res) => {
      hueService.delete(req.params.id_hue_scene)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err));
    });

  router.get('/api/scenes/:id_scene([0-9a-z]{24})/action', (req, res) => {
    Scene.findById(req.params.id_scene)
      .then(scene => makeLocalRequest(scene.actions, config.port, req.headers['x-access-token']))
      .then(() => res.end())
      .catch(err => res.status(500).send(err));
  });

  router.get('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})/action', (req, res) => {
    hueService.recallScene(req.params.id_hue_scene)
      .then(() => res.end())
      .catch(err => res.status(500).send(err));
  });
};
