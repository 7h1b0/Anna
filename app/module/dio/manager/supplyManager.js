function supplyManager(db){
	this.db = db
}

supplyManager.prototype = {

	get: function (id, success, error){
		var that = this;
		this.db.get('SELECT id,name FROM dio_supply WHERE id = ?', id, function (err,row){
			if (err || row === undefined) {
				error(err);
			} else {
				success(row);
			}
		});
	},

	getAll: function (success, error){
		this.db.all('SELECT id,name FROM dio_supply', function (err, rows) {
			if (err || rows === undefined) {
				error(err);
			} else {
				success(rows);
			}
		});
	},

	add: function (supply, success, error){

		this.db.run('INSERT INTO dio_supply(id,name) VALUES (?,?)', [supply.id,supply.name], function (err){
			if (err) {
				error(err);
			} else {
				success();
			}
		});	
	},

	update: function (supply, success, error){
		this.db.run('UPDATE dio_supply SET name = ? WHERE id = ?', [supply.name,supply.id], function (err){
			if (err) {
				error(err);
			} else {
				success();
			}
		});
	},

	delete: function (id, success, error){
		this.db.run('DELETE FROM dio_supply WHERE id = ?', [id], function (err){
			if (err) {
				error(err);
			} else{
				success();
			}
		});	
	},
}

module.exports = supplyManager;