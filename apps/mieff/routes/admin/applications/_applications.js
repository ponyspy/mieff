var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var Params = {
	locale: require('../_params/locale'),
	upload: require('../_params/upload')
};

var applications = {
	list: require('./list.js')(Model),
	edit: require('./edit.js')(Model, Params),
	remove: require('./remove.js')(Model)
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(applications.list.index)
		.post(applications.list.get_list);

	router.route('/edit/:place_id')
		.get(applications.edit.index);

	router.route('/remove')
		.post(applications.remove.index);

	return router;
})();