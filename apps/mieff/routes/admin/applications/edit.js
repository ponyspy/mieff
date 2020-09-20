var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Application = Model.Application;


	module.index = function(req, res, next) {
		var id = req.params.application_id;

		Application.findById(id).exec(function(err, application) {
			if (err) return next(err);

			res.render('admin/applications/edit.pug', { application: application });
		});

	};


	return module;
};