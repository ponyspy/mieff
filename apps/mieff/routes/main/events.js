var moment = require('moment');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Program = Model.Program;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.index = function(req, res, next) {
		res.redirect('/');
	};

	module.event = function(req, res, next) {
		var user_id = req.session.user_id;
		var id = req.params.short_id;

		var Query = user_id
			? Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query
			.populate({'path': 'partners', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'title status _short_id type link logo' })
			.populate({'path': 'members.list', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'name photo sex roles status _short_id' })
			.populate({'path': 'program', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'title status _short_id' })
			.populate({'path': 'events', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'title poster status _short_id' })
			.populate({'path': 'schedule.place', 'match': { 'status': { '$ne': 'hidden' } }, 'select': 'title status _short_id' })
			.exec(function(err, event) {
			if (!event || err) return next(err);

			async.parallel({
				blocks: function(callback) {
					Event.find({'status': {'$ne': 'hidden'}, 'program': event.program._id, '_id': {'$ne': event._id}, 'events': {'$ne': event._id, '$not': {'$size': 0}}}).exec(callback);
				},
				programs: function(callback) {
					Program.find({'_id': {'$ne': event.program._id}}).exec(callback);
				}
			}, function(err, results) {
				if (err) return next(err);

				results['event'] = event;
				results['get_locale'] = get_locale;
				results['moment'] = moment;

				res.render('main/event.pug', results);
			});
		});
	};

	return module;
};