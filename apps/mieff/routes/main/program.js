var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;
	var Event = Model.Event;

	module.index = function(req, res) {
		res.render('main/program.pug');
	};

	return module;
};