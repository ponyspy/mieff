var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;

	module.index = function(req, res) {
		return res.redirect('/');
	};

	module.member = function(req, res, next) {
		var id = req.params.short_id;

		Member.findOne({ '_short_id': id }).where('status').nin(['hidden', 'special']).exec(function(err, member) {
			if (!member || err) return next(err);

			Event.find({'members.list': member._id}).where('status').ne('hidden').populate('program').exec(function(err, events) {
				res.render('main/member.pug', { member: member, events: events });
			});
		});
	}

	return module;
};