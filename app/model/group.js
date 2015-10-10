var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var group = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    devices: [ String ]
});

module.exports = mongoose.model('Group', group);