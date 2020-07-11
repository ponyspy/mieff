var rimraf = require('rimraf');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Program.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			rimraf(__glob_root + '/public/cdn/' + __app_name + '/programs/' + id, { glob: false }, function(err) {
				if (err) return next(err);

				res.send('ok');
			});
		});

	};


	return module;
};