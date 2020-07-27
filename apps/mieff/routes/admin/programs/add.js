var shortid = require('shortid');
var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Program = Model.Program;
	var Partner = Model.Partner;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		Partner.find().sort('title.value').exec(function(err, partners) {
			if (err) return next(err);

			res.render('admin/programs/add.pug', {partners: partners});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;

		var program = new Program();

		program._short_id = shortid.generate();
		program.status = post.status;
		program.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
		program.sym = post.sym ? post.sym : undefined;

		program.partners = post.partners;

		var locales = post.en ? ['ru', 'en'] : ['ru'];

		locales.forEach(function(locale) {
			checkNested(post, [locale, 'title'])
				&& program.setPropertyLocalised('title', post[locale].title, locale);

			checkNested(post, [locale, 'description'])
				&& program.setPropertyLocalised('description', post[locale].description, locale);

		});

		async.series([
			async.apply(uploadImage, program, 'programs', 'cover', 1920, files.cover && files.cover[0], null),
			async.apply(uploadImage, program, 'programs', 'poster', 800, files.poster && files.poster[0], null),
		], function(err, results) {
			if (err) return next(err);

			program.save(function(err, program) {
				if (err) return next(err);

				res.redirect('/admin/programs');
			});
		});
	};


	return module;
};