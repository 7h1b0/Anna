var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scene = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    devices: [{
    	path: { type: String },
    	method: { type: String },
    	body: { type: String }
    }]
});

module.exports = mongoose.model('Scene', scene);