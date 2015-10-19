var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dio = new Schema({
    id_dio: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('Dio', dio);