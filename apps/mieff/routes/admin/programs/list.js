var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;


	module.index = function(req, res, next) {
		Program.find().sort('-date').limit(10).exec(function(err, programs) {
			if (err) return next(err);

			Program.countDocuments().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/programs', {programs: programs, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Program.find({ $text : { $search : post.context.text } } )
			: Program.find();

		if (post.context.status && post.context.status != 'all') {
			Query.where('status').equals(post.context.status);
		}

		Query.countDocuments(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, programs) {
				if (err) return next(err);

				if (programs.length > 0) {
					var opts = {
						programs: programs,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/programs/_programs.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};