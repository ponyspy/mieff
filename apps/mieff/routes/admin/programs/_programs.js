var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var programs = {
	list: require('./list.js')(Model),
	add: require('./add.js')(Model, Params),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(programs.list.index)
		.post(programs.list.get_list);

	router.route('/add')
		.get(programs.add.index)
		.post(programs.add.form);

	router.route('/edit/:program_id')
		.get(programs.edit.index)
		.post(programs.edit.form);

	router.route('/remove')
		.post(programs.remove.index);

	return router;
})();