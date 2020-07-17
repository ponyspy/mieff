var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Program = Model.Program;
	var Place = Model.Place;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.index = function(req, res) {
		// Event.aggregate([
		// 	{ $unwind: '$schedule' },
		// 	{ $match: { 'status': {
		// 		$ne: 'hidden'
		// 	}}},
		// 	{ $group: {
		// 		_id: {
		// 			month: { $month: "$schedule.date" },
		// 			day: { $dayOfMonth: "$schedule.date" },
		// 			year: { $year: "$schedule.date" }
		// 		},
		// 		schedule: {$push: { 'date': '$schedule.date' }},
		// 	}},
		// 	{ $sort: { 'schedule.date': 1 } },
		// 	{ $project: {
		// 		_id: 0,
		// 		month: '$_id.month',
		// 		day: '$_id.day',
		// 		year: '$_id.year',
		// 	}}
		// ]).exec(function(err, dates) {
		// 	return res.send(dates)
		// });


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
						Place.populate(events, {path: 'schedule.place'}, function(err, events) {
							Program.populate(events, {path: 'program'}, function(err, events) {
								res.render('main/index.pug', {
									moment: moment,
									get_locale: get_locale,
									events: events, programs: programs, places: places, dates: dates
								});
							});
						});
					});
				});
			});
		});
	};

	return module;
};