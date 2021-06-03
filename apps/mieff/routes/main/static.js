var fs = require('fs');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Member = Model.Member;
	var Program = Model.Program;

	module.about = function(req, res, next) {
		async.parallel({
			members: function(callback) {
				Member.find({'team': true}).sort('-date').exec(callback)
			},
			programs: function(callback) {
				Program.find({'members': {'$not': {'$size': 0}}}).populate('members').where('status').ne('hidden').sort('-date').exec(callback);
			},
			about: function(callback) {
				fs.readFile(__app_root + '/static/about_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
			// desc: function(callback) {
			// 	fs.readFile(__app_root + '/static/desc_' + req.locale + '.html', 'utf8', function(err, content) {
			// 		callback(null, content || '');
			// 	});
			// },
			// adress: function(callback) {
			// 	fs.readFile(__app_root + '/static/adress_' + req.locale + '.html', 'utf8', function(err, content) {
			// 		callback(null, content || '');
			// 	});
			// },
		}, function(err, results) {
			if (err) return next(err);

			res.render('main/about.pug', results);
		});
	};

	return module;
};