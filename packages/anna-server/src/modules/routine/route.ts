import { Router } from 'express';
import * as Routine from 'modules/routine/model';
import * as RoutineService from 'services/routineService';
import * as logger from 'utils/logger';

const routes = Router();
routes
  .route('/api/routines')
  .get((req, res) => {
    Routine.findAll()
      .then((routines) => res.json(routines))
      .catch((err) => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Routine.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const userId = res.locals.user.userId;
      const { name, sceneId, interval, enabled, runAtBankHoliday } = req.body;

      Routine.save(userId, name, sceneId, interval, enabled, runAtBankHoliday)
        .then((routine) => {
          RoutineService.schedule(routine);
          res.status(201).json({ routineId: routine.routineId });
        })
        .catch((err) => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/routines/:routineId([a-fA-F0-9-]{36})')
  .get((req, res) => {
    Routine.findById(req.params.routineId)
      .then((routine) => {
        if (!routine) {
          res.sendStatus(404);
        } else {
          res.json(routine);
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  })
  .patch((req, res) => {
    const isValid = Routine.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const routineId = req.params.routineId;
      const nextRunAt = Routine.computeNextRunAt(
        req.body.interval,
        req.body.runAtBankHoliday,
      );
      Routine.findByIdAndUpdate(routineId, { ...req.body, nextRunAt })
        .then(async (rowsAffected) => {
          if (!!rowsAffected) {
            const routine = await Routine.findById(routineId);
            RoutineService.schedule(routine);
            res.sendStatus(204);
          } else {
            res.sendStatus(404);
          }
        })
        .catch((err) => res.status(500).send({ err }));
    }
  })
  .delete((req, res) => {
    Routine.remove(req.params.routineId)
      .then((removedScene) => {
        if (removedScene < 1) {
          res.sendStatus(404);
        } else {
          RoutineService.stop(req.params.routineId);
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  });

routes.get('/api/routines/:routineId([a-fA-F0-9-]{36})/action', (req, res) => {
  Routine.findById(req.params.routineId)
    .then((routine) => {
      if (routine) {
        return Routine.run(routine);
      }
      throw new Error('Routine not found');
    })
    .then(() => res.end())
    .catch((err) => {
      if (err.message === 'Routine not found') {
        res.sendStatus(404);
      } else {
        logger.error(err);
        res.status(500).send({ err });
      }
    });
});

export default routes;
