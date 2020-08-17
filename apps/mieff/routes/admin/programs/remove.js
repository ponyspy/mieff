var rimraf = require('rimraf');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.series([
			function(callback) {
				Event.update({ 'program': id}, { $unset: { 'program': id}}, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Program.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/programs/' + id, { glob: false }, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});

	};


	return module;
};