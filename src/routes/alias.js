import { Router } from 'express';
import dispatch from '../modules/dispatch';
import { callScene } from '../modules/actions';
import * as Alias from '../modules/models/alias';

const routes = Router();

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
        .then(aliasId => res.status(201).json(aliasId))
        .catch(err => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/alias/:id_alias([a-fA-F0-9-]{36})')
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
        sceneId: req.body.sceneId,
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
    Alias.remove(req.params.id_alias)
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
  '/api/alias/:id_alias([a-fA-F0-9-]{36})/:enabled(enable|disable)',
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

routes.get('/api/alias/:name([a-z_]{4,})/action', (req, res) => {
  Alias.findByName(req.params.name)
    .then(alias => {
      if (!alias) return res.sendStatus(404);
      if (alias.enabled !== true) return res.sendStatus(403);

      return dispatch(callScene(alias.sceneId)).then(() => res.end());
    })
    .catch(err => res.status(500).send({ err }));
});

export default routes;
