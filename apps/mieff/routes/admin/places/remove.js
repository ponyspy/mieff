

module.exports = function(Model) {
	var module = {};

	var Place = Model.Place;
	var Event = Model.Event;


	module.index = function(req, res, next) {
		var id = req.body.id;

		Place.findByIdAndRemove(id).exec(function(err) {
			if (err) return next(err);

			Event.update({}, { $pull: { 'schedule': {'place': id} }}, { 'multi': true }).exec(function() {

				res.send('ok');
			});
		});

	};


	return module;
};