var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	CommandSchema   = new Schema({
		command: String,
		url: String
	});

module.exports = mongoose.model('Command', CommandSchema);