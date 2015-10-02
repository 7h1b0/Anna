function powerSupplyManager(db){
	this.db = db
}

powerSupplyManager.prototype = {

	getSupplies: function (id, success, error){
		this.db.all('SELECT id_supply FROM dio_supplies WHERE id_group = ?',id, function (err, rows) {
			if (err || rows === undefined) {
				error(err);
			} else {
				var supplies = [];
				for(var i = 0; i < rows.length; i++){
					supplies.push(rows[i].id_supply);
				}
				success(supplies);
			}
		});
	},

	getAll: function (success, error){
		this.db.all('SELECT id,name FROM dio_group', function (err, rows) {
			if (err || rows === undefined) {
				error(err);
			} else {
				success(rows);
			}
		});
	},

	add: function (group, success, error){
		var self = this;
		self.db.run('INSERT INTO dio_group(name) VALUES (?)', [group.name], function (err){
			if (err) {
				error(err);
			} else {
				var lastID = this.lastID;
				var stmt = self.db.prepare("INSERT INTO dio_supplies(id_group,id_supply) VALUES (?,?)");
				for (var i = 0, length = group.supplies.length; i < length; i++) {
					stmt.run([lastID, group.supplies[i]]);
				}
				stmt.finalize();
				success(lastID);
			}
		});	
	},

	update: function (group, success, error){
		this.db.run('UPDATE dio_group SET name = ? WHERE id = ?', [group.name,group.id_device], function (err){
			if (err) {
				error(err);
			} else {
				success();
			}
		});
	},

	delete: function (id, success, error){
		this.db.run('DELETE FROM dio_group WHERE id = ?', [id]);
		this.db.run('DELETE FROM dio_supplies WHERE id_group = ?', [id], function (err){
			if (err) {
				error(err);
			} else{
				success();
			}
		});	
	},
}

module.exports = powerSupplyManager;