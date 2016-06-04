const Scene = require('./../models/scene');

module.exports = app => {
  app.route('/api/scenes')
    .get((req, res) => {
      Scene.find({})
        .then(scenes => res.send(scenes))
        .catch(err => res.status(500).send({ err }));
    })

    .post((req, res) => {
      const newScene = new Scene({
        name: req.body.name,
        description: req.body.description,
        actions: req.body.actions,
      });

      newScene.save()
        .then(scene => res.status(201).send(scene))
        .catch(err => res.status(500).send({ err }));
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
      Scene.findByIdAndUpdate(req.params.id_scene, req.body, { new: true })
        .then(scene => {
          if (!scene) {
            res.sendStatus(404);
          } else {
            res.send(scene);
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

  app.route('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})')
    .get((req, res) => {
      app.service.hue.getScene(req.params.id_hue_scene)
        .then(light => res.send(light))
        .catch(err => res.status(500).send({ err }));
    })

    .delete((req, res) => {
      app.service.hue.delete(req.params.id_hue_scene)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send({ err }));
    });

  app.get('/api/scenes/:id_scene([0-9a-z]{24})/action', (req, res) => {
    Scene.findById(req.params.id_scene)
      .then(scene => {
        scene.recall(app.service.hue);
        res.end();
      })
      .catch(err => res.status(500).send({ err }));
  });

  app.get('/api/scenes/:id_hue_scene([0-9a-zA-Z-]{15})/action', (req, res) => {
    app.service.hue.recallScene(req.params.id_hue_scene)
      .then(() => res.end())
      .catch(err => res.status(500).send({ err }));
  });
};
