const routes = require('express').Router();
const dispatch = require('../modules/dispatch');
const actions = require('../modules/actions');
const Alias = require('../modules/models/alias');

routes
  .route('/api/alias')
  .get((req, res) => {
    Alias.findAll()
      .then(alias => res.json(alias))
      .catch(err => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Alias.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const userId = res.locals.user.userId;
      Alias.save({ ...req.body, userId })
        .then(alias => res.status(201).json(alias))
        .catch(err => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/alias/:id_alias(\\d+)')
  .get((req, res) => {
    Alias.findById(req.params.id_alias)
      .then(alias => {
        if (!alias) {
          res.sendStatus(404);
        } else {
          res.json(alias);
        }
      })
      .catch(err => res.status(500).send({ err }));
  })
  .patch((req, res) => {
    const isValid = Alias.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const updatedAlias = {
        name: req.body.name,
        description: req.body.description,
        enabled: req.body.enabled,
        scene_id: req.body.sceneId,
      };
      Alias.findByIdAndUpdate(req.params.id_alias, updatedAlias)
        .then(rowsAffected => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    }
  })
  .delete((req, res) => {
    Alias.delete(req.params.id_alias)
      .then(alias => {
        if (!alias) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch(err => res.status(500).send({ err }));
  });

routes.get(
  '/api/alias/:id_alias(\\d+)/:enabled(enable|disable)',
  (req, res) => {
    Alias.findByIdAndUpdate(req.params.id_alias, {
      enabled: req.params.enabled === 'enable',
    })
      .then(rowsAffected => {
        if (rowsAffected < 1) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch(err => res.status(500).send({ err }));
  },
);

routes.get('/api/alias/:name([_a-z]{5,})', (req, res) => {
  Alias.findByName(req.params.name)
    .then(alias => {
      if (!alias) return res.sendStatus(404);
      if (alias.enabled !== true) return res.sendStatus(403);

      return dispatch(actions.callScene(alias.sceneId)).then(() => res.end());
    })
    .catch(err => res.status(500).send({ err }));
});

module.exports = routes;
