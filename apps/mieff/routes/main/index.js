var moment = require('moment');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Program = Model.Program;
	var Place = Model.Place;

	module.index = function(req, res) {
		Program.find().exec(function(err, programs) {
			Place.find().exec(function(err, places) {
				Event.find().distinct('schedule.date', function(err, dates) {
					res.render('main/index.pug', {moment: moment, programs: programs, places: places, dates: dates});
				});
			});
		});
	};

	return module;
};