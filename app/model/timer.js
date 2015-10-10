var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timer = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    time: { type: Number, required: true, min: 1000 },
    actions: [{
    	path: { type: String },
    	method: { type: String },
    	body: { type: String }
    }]
});

module.exports = mongoose.model('Timer', timer);