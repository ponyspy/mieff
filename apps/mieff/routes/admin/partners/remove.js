var rimraf = require('rimraf');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		async.series([
			function(callback) {
				Event.update({}, { $pull: { 'partners': id } }, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Partner.findByIdAndRemove(id).exec(callback);
			},
			function(callback) {
				rimraf(__glob_root + '/public/cdn/' + __app_name + '/partners/' + id, { glob: false }, callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};