var shortid = require('shortid');
var moment = require('moment');
var fs = require('fs');
var mime = require('mime');
var mkdirp = require('mkdirp');

module.exports = function(Model) {
	var module = {};

	var Application = Model.Application;

	module.index = function(req, res) {
		return res.render('main/opencall.pug');
	};

	module.application = function(req, res) {
		return res.render('main/application.pug');
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

				setTimeout(function() {
					console.log(item)
				}, 500)
			}
		});

		application.save(function(err, application) {
			res.redirect('back');
		});
	}

	return module;
};