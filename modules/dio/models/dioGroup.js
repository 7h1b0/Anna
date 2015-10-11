var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dioGroup = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    supplies: [Number]
});

module.exports = mongoose.model('DioGroup', dioGroup);