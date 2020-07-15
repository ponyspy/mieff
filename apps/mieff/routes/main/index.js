var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Program = Model.Program;
	var Place = Model.Place;

	module.index = function(req, res) {
		Program.find().exec(function(err, programs) {
			Place.find().exec(function(err, places) {
				Event.find().distinct('schedule.date', function(err, dates) {
					Event.aggregate([
						{ $unwind: '$schedule' },
						{ $match: { 'status': {
							$ne: 'hidden'
						}}},
						{ $sort: { 'schedule.date': 1 } },
					])
					.exec(function(err, events) {
						res.render('main/index.pug', {moment: moment, events: events, programs: programs, places: places, dates: dates});
					});
				});
			});
		});
	};

	return module;
};