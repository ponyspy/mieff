var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;
	var Event = Model.Event;

	module.index = function(req, res) {
		Program.find().where('status').ne('hidden').exec(function(err, programs) {
			res.render('main/program.pug', {programs: programs});
		});
	};

	return module;
};