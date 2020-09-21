var fs = require('fs');
var async = require('async');

exports.edit = function(req, res) {
	async.series({
		// link: function(callback) {
		// 	fs.readFile(__app_root + '/static/link.html', 'utf8', callback);
		// },
		about_ru: function(callback) {
			fs.readFile(__app_root + '/static/about_ru.html', 'utf8', callback);
		},
		about_en: function(callback) {
			fs.readFile(__app_root + '/static/about_en.html', 'utf8', callback);
		},
		opencall_desc_ru: function(callback) {
			fs.readFile(__app_root + '/static/opencall_desc_ru.html', 'utf8', callback);
		},
		opencall_desc_en: function(callback) {
			fs.readFile(__app_root + '/static/opencall_desc_en.html', 'utf8', callback);
		},
		opencall_intro_ru: function(callback) {
			fs.readFile(__app_root + '/static/opencall_intro_ru.html', 'utf8', callback);
		},
		opencall_intro_en: function(callback) {
			fs.readFile(__app_root + '/static/opencall_intro_en.html', 'utf8', callback);
		},
		// adress_ru: function(callback) {
		// 	fs.readFile(__app_root + '/static/adress_ru.html', 'utf8', callback);
		// },
		// adress_en: function(callback) {
		// 	fs.readFile(__app_root + '/static/adress_en.html', 'utf8', callback);
		// }
	}, function(err, results) {
		res.render('admin/cv.pug', { content: results });
	});
};

exports.edit_form = function(req, res) {
	var post = req.body;

	async.series({
		// link: function(callback) {
		// 	if (!post.link) return callback(null);

		// 	fs.writeFile(__app_root + '/static/link.html', post.link, callback);
		// },
		about_ru: function(callback) {
			if (!post.about.ru) return callback(null);

			fs.writeFile(__app_root + '/static/about_ru.html', post.about.ru, callback);
		},
		about_en: function(callback) {
			if (!post.about.en) return callback(null);

			fs.writeFile(__app_root + '/static/about_en.html', post.about.en, callback);
		},
		opencall_desc_ru: function(callback) {
			if (!post.opencall_desc.en) return callback(null);

			fs.writeFile(__app_root + '/static/opencall_desc_ru.html', post.opencall_desc.ru, callback);
		},
		opencall_desc_en: function(callback) {
			if (!post.opencall_desc.en) return callback(null);

			fs.writeFile(__app_root + '/static/opencall_desc_en.html', post.opencall_desc.en, callback);
		},
		opencall_intro_ru: function(callback) {
			if (!post.opencall_intro.en) return callback(null);

			fs.writeFile(__app_root + '/static/opencall_intro_ru.html', post.opencall_intro.ru, callback);
		},
		opencall_intro_en: function(callback) {
			if (!post.opencall_intro.en) return callback(null);

			fs.writeFile(__app_root + '/static/opencall_intro_en.html', post.opencall_intro.en, callback);
		},
		// desc_ru: function(callback) {
		// 	if (!post.desc.ru) return callback(null);

		// 	fs.writeFile(__app_root + '/static/desc_ru.html', post.desc.ru, callback);
		// },
		// desc_en: function(callback) {
		// 	if (!post.desc.en) return callback(null);

		// 	fs.writeFile(__app_root + '/static/desc_en.html', post.desc.en, callback);
		// },
		// adress_ru: function(callback) {
		// 	if (!post.adress.ru) return callback(null);

		// 	fs.writeFile(__app_root + '/static/adress_ru.html', post.adress.ru, callback);
		// },
		// adress_en: function(callback) {
		// 	if (!post.adress.en) return callback(null);

		// 	fs.writeFile(__app_root + '/static/adress_en.html', post.adress.en, callback);
		// }
	}, function(err, results) {
		res.redirect('back');
	});
};