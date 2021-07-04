import { Router } from 'express';
import * as Room from '../../modules/room/model';
import { findByRoomId as findDio } from '../../modules/dio/model';
import { getLights, getSensorsByRoomId } from '../../services/hueService';

const routes = Router();
routes
  .route('/api/rooms')
  .get((req, res) => {
    Room.findAll()
      .then((rooms) => res.json(rooms))
      .catch((err) => res.status(500).send({ err }));
  })
  .post((req, res) => {
    const isValid = Room.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      const userId = res.locals.user.userId;
      Room.save({ ...req.body, userId })
        .then((newRoomId) => res.status(201).json(newRoomId))
        .catch((err) => res.status(500).send({ err }));
    }
  });

routes
  .route('/api/rooms/:room_id([a-fA-F0-9-]{36})')
  .get((req, res) => {
    const roomId = req.params.room_id;
    const fetchDio = findDio(roomId);
    const fetchAllLights = getLights();
    const fetchSensors = getSensorsByRoomId(roomId);
    const fetchRoom = Room.findById(roomId);

    Promise.all([fetchRoom, fetchDio, fetchAllLights, fetchSensors])
      .then(([room, dios, lights, sensors]) => {
        if (!room) {
          return res.sendStatus(404);
        }
        const filteredLights = lights.filter(
          (light) => light.roomId === roomId,
        );

        res.json(
          Object.assign(room, {
            devices: {
              dios,
              hueLights: filteredLights,
            },
            sensors,
          }),
        );
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  })
  .patch((req, res) => {
    const isValid = Room.validate(req.body);
    if (!isValid) {
      res.sendStatus(400);
    } else {
      Room.findByIdAndUpdate(req.params.room_id, req.body)
        .then((rowsAffected) => {
          if (rowsAffected < 1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch((err) => res.status(500).send({ err }));
    }
  })
  .delete((req, res) => {
    Room.remove(req.params.room_id)
      .then((rowsAffected) => {
        if (rowsAffected < 1) {
          res.sendStatus(403);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => res.status(500).send({ err }));
  });

export default routes;
