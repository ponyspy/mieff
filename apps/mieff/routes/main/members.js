var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Event = Model.Event;

	module.index = function(req, res) {
		Member.find().where('status').nin(['hidden', 'special']).sort('-date').exec(function(err, members) {
			Member.find().where('status').nin(['hidden', 'special']).distinct('roles').exec(function(err, roles) {
				var actual_roles = Object.keys(req.app.locals.static_types.members_roles);

				roles.sort(function(a, b) {
					return actual_roles.indexOf(a) - actual_roles.indexOf(b);
				});

				res.render('main/members.pug', { members: members, roles: roles });
			});
		});
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