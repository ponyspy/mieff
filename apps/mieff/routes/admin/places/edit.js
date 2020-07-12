var moment = require('moment');

module.exports = function(Model, Params) {
	var module = {};

	var Place = Model.Place;

	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.place_id;

		Place.findById(id).exec(function(err, place) {
			if (err) return next(err);

			res.render('admin/places/edit.pug', { place: place });
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.place_id;

		Place.findById(id).exec(function(err, place) {
			if (err) return next(err);

			place.status = post.status;
			place.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& place.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& place.setPropertyLocalised('description', post[locale].description, locale);

			});

			place.save(function(err, place) {
				if (err) return next(err);

				res.redirect('back');
			});
		});
	};


	return module;
};