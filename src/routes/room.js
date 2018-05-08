const Room = require('../modules/models/room');

module.exports = app => {
  app.route('/api/rooms').get((req, res) => {
    Room.findAll()
      .then(rooms => res.send(rooms))
      .catch(err => res.status(500).send({ err }));
  });

  app
    .route('/api/rooms/:room_id([0-9]{1,2})')
    .get((req, res) => {
      Room.findById(req.params.room_id)
        .then(room => {
          if (!room) {
            res.sendStatus(404);
          } else {
            res.send(room);
          }
        })
        .catch(err => res.status(500).send({ err }));
    })
    .delete((req, res) => {
      Room.delete(req.params.room_id)
        .then(dio => {
          if (!dio) {
            res.sendStatus(404);
          } else {
            res.sendStatus(204);
          }
        })
        .catch(err => res.status(500).send({ err }));
    });
};
