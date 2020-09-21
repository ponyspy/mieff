var shortid = require('shortid');
var moment = require('moment');
var fs = require('fs');
var mime = require('mime');
var mkdirp = require('mkdirp');
var async = require('async');

module.exports = function(Model) {
	var module = {};

	var Application = Model.Application;

	module.index = function(req, res) {
		async.parallel({
			desc: function(callback) {
				fs.readFile(__app_root + '/static/opencall_desc_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
		}, function(err, results) {
			if (err) return next(err);

			results.complete = req.query.complete;

			res.render('main/opencall.pug', results);
		});
	};

	module.application = function(req, res) {
		async.parallel({
			intro: function(callback) {
				fs.readFile(__app_root + '/static/opencall_intro_' + req.locale + '.html', 'utf8', function(err, content) {
					callback(null, content || '');
				});
			},
		}, function(err, results) {
			if (err) return next(err);

			res.render('main/application.pug', results);
		});
	};

	module.form = function(req, res, next) {
		var application = new Application();

		application._short_id = shortid.generate();
		application.date = moment();
		application.type = req.body.type;
		application.text = req.body.text;
		application.files = [];

		['cv', 'portfolio'].forEach(function(item) {
			if (req.files[item]) {
				var file = req.files[item][0];

				var public_path = __glob_root + '/public';
				var file_path = '/cdn/applications/' + application._id + '/files';
				var file_name = Date.now() + '.' + mime.getExtension(file.mimetype);

				mkdirp.sync(public_path + file_path);
				fs.renameSync(file.path, public_path + file_path + '/' + file_name);
				application.files.push({'name': item, 'path': file_path + '/' + file_name});
			}
		});

		application.save(function(err, application) {
			res.redirect('/opencall?complete=true');
		});
	}

	return module;
};