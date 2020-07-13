var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Place = Model.Place;


	module.index = function(req, res, next) {
		Place.find().sort('-date').limit(10).exec(function(err, places) {
			if (err) return next(err);

			Place.countDocuments().exec(function(err, count) {
				if (err) return next(err);

				res.render('admin/places', {places: places, count: Math.ceil(count / 10)});
			});
		});
	};


	module.get_list = function(req, res, next) {
		var post = req.body;

		var Query = (post.context.text && post.context.text !== '')
			? Place.find({ $text : { $search : post.context.text } } )
			: Place.find();

		Query.countDocuments(function(err, count) {
			if (err) return next(err);

			Query.find().sort('-date').skip(+post.context.skip).limit(+post.context.limit).exec(function(err, places) {
				if (err) return next(err);

				if (places.length > 0) {
					var opts = {
						places: places,
						count: Math.ceil(count / 10),
						skip: +post.context.skip,
						compileDebug: false, debug: false, cache: true, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/admin/places/_places.pug', opts));
				} else {
					res.send('end');
				}
			});
		});
	};


	return module;
};