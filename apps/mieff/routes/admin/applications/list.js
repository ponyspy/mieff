var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Application = Model.Application;


	module.index = function(req, res, next) {
		Application.find().sort('-date').limit(10).exec(function(err, applications) {
			if (err) return next(err);

			Application.countDocuments().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/applications', {applications: applications, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Application.find({ $text : { $search : post.context.text } } )
			: Application.find();

		Query.countDocuments(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, applications) {
				if (err) return next(err);

				if (applications.length > 0) {
					var opts = {
						applications: applications,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/applications/_applications.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};