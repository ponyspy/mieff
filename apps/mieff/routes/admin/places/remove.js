var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Place = Model.Place;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;


		async.series([
			function(callback) {
				Event.update({}, { $pull: { 'schedule': {'place': id} }}, { 'multi': true }).exec(callback);
			},
			function(callback) {
				Place.findByIdAndRemove(id).exec(callback);
			}
		], function(err) {
			if (err) return next(err);

			res.send('ok');
		});
	};


	return module;
};