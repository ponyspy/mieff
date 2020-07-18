var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;
	var Event = Model.Event;

	module.index = function(req, res) {
		Program.find().where('status').ne('hidden').exec(function(err, programs) {
			res.render('main/programs.pug', {programs: programs});
		});
	};

	module.program = function(req, res) {
		var user_id = req.session.user_id;
		var id = req.params.short_id;

		var Query = user_id
			? Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] })
			: Event.findOne({ $or: [ { '_short_id': id }, { 'sym': id } ] }).where('status').ne('hidden');

		Query.exec(function(err, program) {
			res.render('main/program.pug', {program: program});
		});
	};

	return module;
};