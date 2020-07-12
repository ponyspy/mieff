var moment = require('moment');
var async = require('async');

module.exports = function(Model, Params) {
	var module = {};

	var Event = Model.Event;
	var Member = Model.Member;
	var Partner = Model.Partner;

	var previewImages = Params.upload.preview;
	var uploadImages = Params.upload.images;
	var uploadImage = Params.upload.image;
	var checkNested = Params.locale.checkNested;
	var youtubeId = Params.helpers.youtubeId;
	var vimeoId = Params.helpers.vimeoId;


	module.index = function(req, res, next) {
		var id = req.params.event_id;

		Event.findById(id).exec(function(err, event) {
			if (err) return next(err);

			Member.find().sort('name.value').exec(function(err, members) {
				if (err) return next(err);

				Partner.find().sort('title.value').exec(function(err, partners) {

					previewImages(event.images, function(err, images_preview) {
						if (err) return next(err);

						res.render('admin/events/edit.pug', { event: event, members: members, partners: partners, images_preview: images_preview });
					});
				});
			});
		});

	};


	module.form = function(req, res, next) {
		var post = req.body;
		var files = req.files;
		var id = req.params.event_id;

		Event.findById(id).exec(function(err, event) {
			if (err) return next(err);

			event.status = post.status;
			event.date = moment(post.date.date + 'T' + post.date.time.hours + ':' + post.date.time.minutes);
			event.age = post.age;
			event.sym = post.sym ? post.sym : undefined;
			event.w_alias = post.w_alias ? post.w_alias : undefined;

			event.partners = post.partners;

			event.schedule = post.schedule ? post.schedule.reduce(function(arr, schedule) {
				if (schedule.date != '') {
					arr.push({
						date: moment(schedule.date + 'T' + schedule.time.hours + ':' + schedule.time.minutes),
						link: schedule.link == '' ? undefined : schedule.link,
						options: schedule.options == '' ? undefined : schedule.options,
						premiere: schedule.premiere
					});
				}

				return arr;
			}, []) : [];

			event.members = post.members ? post.members.map(function(group) {
				return {
					mode: group.mode,
					title: [{ 'lg':'ru', 'value': group.title.ru }, { 'lg':'en', 'value': group.title.en }],
					list: group.list ? group.list.filter(function(item) { return item !== ''; }) : []
				};
			}) : [];

			if (youtubeId(post.video)) {
				event.video = {
					provider: 'youtube',
					id: youtubeId(post.video)
				}
			} else if (vimeoId(post.video)) {
				event.video = {
					provider: 'vimeo',
					id: vimeoId(post.video)
				}
			} else {
				event.video = undefined;
			}

			var locales = post.en ? ['ru', 'en'] : ['ru'];

			locales.forEach(function(locale) {
				checkNested(post, [locale, 'title'])
					&& event.setPropertyLocalised('title', post[locale].title, locale);

				checkNested(post, [locale, 'duration'])
					&& event.setPropertyLocalised('duration', post[locale].duration, locale);

				checkNested(post, [locale, 'country'])
					&& event.setPropertyLocalised('country', post[locale].country, locale);

				checkNested(post, [locale, 'premiere'])
					&& event.setPropertyLocalised('premiere', post[locale].premiere, locale);

				checkNested(post, [locale, 'description'])
					&& event.setPropertyLocalised('description', post[locale].description, locale);

			});

			async.series([
				async.apply(uploadImages, event, 'events', post.hold, post.images),
				async.apply(uploadImage, event, 'events', 'poster', 800, files.poster && files.poster[0], post.poster_del),
			], function(err, results) {
				if (err) return next(err);

				event.save(function(err, event) {
					if (err) return next(err);

					res.redirect('back');
				});
			});
		});
	};


	return module;
};