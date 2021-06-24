var moment = require('moment');
var pug = require('pug');
var mongoose = require('mongoose');
var async = require('async');
var fs = require('fs');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Program = Model.Program;
	var Place = Model.Place;
	var Post = Model.Post;

	var to_Objectid = function(ids) {
		return ids.map(function(id) {
			return mongoose.Types.ObjectId(id);
		});
	}

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.index = function(req, res) {
		async.parallel({
			main_text: function(callback) {
				fs.readFile(__app_root + '/static/main_text_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			main_banner_link: function(callback) {
				fs.readFile(__app_root + '/static/main_banner_link' + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			posts: function(callback) {
				Post.find().where('status').ne('hidden').sort('-date').limit(4).exec(callback);
			},
			programs: function(callback) {
				Program.find().where('status').ne('hidden').exec(callback);
			},
			places: function(callback) {
				Place.find().where('status').ne('hidden').exec(callback);
			},
			dates: function(callback) {
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
				]).exec(callback);
			},
		}, function(err, results) {
			if (err) return next(err);

			results['moment'] = moment;

			res.render('main/index.pug', results);
		});
	}


	module.get_events = function(req, res) {
		dates = req.body.context && req.body.context.date && req.body.context.date.map(function(date) {
			var date_start = moment(date, "YY-MM-DD").startOf('day')
			var date_end = moment(date, "YY-MM-DD").endOf('day')

			return { 'schedule.date': { $gte: date_start.toDate(), $lte: date_end.toDate() }};
		});

		Event.aggregate([
			{ $unwind: '$schedule' },
			{ $match: { 'status': {
				$ne: 'hidden'
			}}},
			{ $match: { $or: dates || [{ 'schedule.date': {'$ne': 'none'}}] }},
			{	$match: { 'type': req.body.context && req.body.context.type ? { '$in': req.body.context.type } : {'$ne': 'none'} }},
			{	$match: { 'schedule.place': req.body.context && req.body.context.place ? { '$in': to_Objectid(req.body.context.place) } : {'$ne': 'none'} }},
			{	$match: { 'program': req.body.context && req.body.context.program ? { '$in': to_Objectid(req.body.context.program) } : {'$ne': 'none'} }},
			{ $sort: { 'schedule.date': 1 } },
			{ $group: {
				_id: {
					year: { $year: '$schedule.date' },
					month: { $month: '$schedule.date' },
					date: { $dayOfMonth: '$schedule.date' }
				},
				events: {
					$push: '$$ROOT'
			}}},
			{ $sort: { '_id.month': 1, '_id.year': 1, '_id.date': 1 } },
		])
		.exec(function(err, schedule) {
			Place.populate(schedule, {path: 'events.schedule.place'}, function(err, schedule) {
				Program.populate(schedule, {path: 'events.program'}, function(err, schedule) {
					var opts = {
						__: function() { return res.locals.__.apply(null, arguments); },
						__n: function() { return res.locals.__n.apply(null, arguments); },
						locale: req.locale,
						static_types: req.app.locals.static_types,
						moment: moment,
						get_locale: get_locale,
						schedule: schedule,
						compileDebug: false, debug: false, cache: true, pretty: false
					}

					res.send(pug.renderFile(__app_root + '/views/main/_events.pug', opts));
				});
			});
		});
	}


	return module;
};