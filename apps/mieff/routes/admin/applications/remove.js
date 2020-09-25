var async = require('async');
var rimraf  = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Application = Model.Application;


	module.index = function(req, res, next) {
		var id = req.body.id;


		async.series([
			function(callback) {
				Application.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/applications/' + id, { glob: false }, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};