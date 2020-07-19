var pug = require('pug');
var moment = require('moment');
var mongoose = require('mongoose');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;
	var Event = Model.Event;
	var Place = Model.Place;

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
		Program.find().where('status').ne('hidden').exec(function(err, programs) {
			res.render('main/programs.pug', {programs: programs});
		});
	};

	module.program = function(req, res) {
		var user_id = req.session.user_id;
		var id = req.params.short_id;

		var Query = user_id
			? Program.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Program.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query.exec(function(err, program) {
			Program.find({'_id': {'$ne': program._id} }).where('status').ne('hidden').exec(function(err, programs) {
				Event.find({'program': program._id, 'events': {'$not': {'$size': 0}}}).where('status').ne('hidden').exec(function(err, blocks) {
					res.render('main/program.pug', {program: program, programs: programs, blocks: blocks});
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
			{	$match: { 'type': req.body.context && req.body.context.type ? { '$in': req.body.context.type } : {'$ne': 'none'} }},
			{	$match: { 'schedule.place': req.body.context && req.body.context.place ? { '$in': to_Objectid(req.body.context.place) } : {'$ne': 'none'} }},
			{	$match: { 'program': req.body.context && req.body.context.program ? { '$in': to_Objectid(req.body.context.program) } : {'$ne': 'none'} }},
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