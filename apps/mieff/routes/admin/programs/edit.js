var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Program = Model.Program;
	var Partner = Model.Partner;
	var Member = Model.Member;

	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;


	module.index = function(req, res, next) {
		var id = req.params.program_id;

		Program.findById(id).exec(function(err, program) {
			if (err) return next(err);

			Partner.find().sort('title.value').exec(function(err, partners) {
				if (err) return next(err);

				Member.find().sort('name.value').exec(function(err, members) {
					if (err) return next(err);

					res.render('admin/programs/edit.pug', { program: program, partners: partners, members: members });
				});
			});
		});
	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.program_id;

		Program.findById(id).exec(function(err, program) {
			if (err) return next(err);

			program.status = post.status;
			program.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			program.sym = post.sym ? post.sym : undefined;

			program.partners = post.partners.filter(function(partner) { return partner != 'none'; });
			program.members = post.members.filter(function(member) { return member != 'none'; });

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& program.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'description'])
					&& program.setPropertyLocalised('description', post[locale].description, locale);

			});

			async.series([
				async.apply(uploadImage, program, 'programs', 'cover', 1920, files.cover && files.cover[0], post.cover_del),
				async.apply(uploadImage, program, 'programs', 'poster', 800, files.poster && files.poster[0], post.poster_del),
			], function(err, results) {
				if (err) return next(err);

				program.save(function(err, program) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};