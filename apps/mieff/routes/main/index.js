var moment = require('moment');
var pug = require('pug');

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
				Event.aggregate([
					{ $unwind: '$schedule' },
					{ $match: { 'status': {
						$ne: 'hidden'
					}}},
					{ $group: {
						_id: {
							month: { $month: "$schedule.date" },
							day: { $dayOfMonth: "$schedule.date" },
							year: { $year: "$schedule.date" }
						},
						schedule: {$push: { 'date': '$schedule.date' }},
					}},
					{ $sort: { 'schedule.date': 1 } },
					{ $project: {
						_id: 0,
						month: '$_id.month',
						day: '$_id.day',
						year: '$_id.year',
					}}
				]).exec(function(err, dates) {
					res.render('main/index.pug', {
						programs: programs, places: places, dates: dates
					});
				});
			});
		});
	};


	module.get_events = function(req, res) {
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
					var opts = {
						__: function() { return res.locals.__.apply(null, arguments); },
						__n: function() { return res.locals.__n.apply(null, arguments); },
						locale: req.locale,
						static_types: req.app.locals.static_types,
						moment: moment,
						get_locale: get_locale,
						events: events,
						compileDebug: false, debug: false, cache: true, pretty: false
					}

					res.send(pug.renderFile(__app_root + '/views/main/_events.pug', opts));
				});
			});
		});
	}


	return module;
};