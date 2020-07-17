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
		Program.find().exec(function(err, programs) {
			Place.find().exec(function(err, places) {
				Event.find().distinct('schedule.date', function(err, dates) {
					dates = dates.filter(function(item, pos) {
						return dates.indexOf(item) == pos;
					});

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