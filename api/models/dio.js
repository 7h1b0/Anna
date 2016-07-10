const mongoose = require('mongoose');
const ExecutorService = require('./../services/executorService.js');
const Schema = mongoose.Schema;

const dio = new Schema({
  id_dio: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
});

const exec = (device, on) => {
  const status = on ? 1 : 0;
  ExecutorService.getInstance().add(`./radioEmission ${device} ${status}`);
};

dio.statics.updateState = function updateState(device, on = false) {
  exec(device, on);
};

dio.methods.on = function on() {
  exec(this.id_dio, true);
};

dio.methods.off = function off() {
  exec(this.id_dio, false);
};

module.exports = mongoose.model('Dio', dio);
