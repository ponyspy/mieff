var fs = require('fs');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	module.about = function(req, res, next) {
		async.parallel({
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