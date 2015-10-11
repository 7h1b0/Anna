var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dioSupply = new Schema({
    id_supply: { type: Number, required: true, unique: true },
    name: { type: String, required: true }
});

module.exports = mongoose.model('DioSupply', dioSupply);