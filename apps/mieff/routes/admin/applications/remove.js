var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Application = Model.Application;


	module.index = function(req, res, next) {
		var id = req.body.id;


		async.series([
			function(callback) {
				Application.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};