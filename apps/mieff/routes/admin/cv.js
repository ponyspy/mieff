var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var mime = require('mime');


exports.edit = function(req, res) {
	async.series({
		main_banner_link: function(callback) {
			fs.readFile(__app_root + '/static/main_banner_link.html', 'utf8', callback);
		},
		main_text_ru: function(callback) {
			fs.readFile(__app_root + '/static/main_text_ru.html', 'utf8', callback);
		},
		main_text_en: function(callback) {
			fs.readFile(__app_root + '/static/main_text_en.html', 'utf8', callback);
		},
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
	var files = req.files;

	async.series({
		main_banner_image: function(callback) {
			if (!files['main_banner_image']) return callback(null);

			var file = files['main_banner_image'][0];

			mkdirp(__glob_root + '/public/cdn/images', function() {
				fs.rename(file.path, __glob_root + '/public/cdn/images/main_banner_image' + '.' + mime.getExtension(file.mimetype), callback);
			});
		},
		og_image: function(callback) {
			if (!files['og_image']) return callback(null);

			var file = files['og_image'][0];

			mkdirp(__glob_root + '/public/cdn/images', function() {
				fs.rename(file.path, __glob_root + '/public/cdn/images/og_image' + '.' + mime.getExtension(file.mimetype), callback);
			});
		},
		main_banner_link: function(callback) {
			if (!post.main_banner_link) return callback(null);

			fs.writeFile(__app_root + '/static/main_banner_link.html', post.main_banner_link, callback);
		},
		main_text_ru: function(callback) {
			if (!post.main_text.ru) return callback(null);

			fs.writeFile(__app_root + '/static/main_text_ru.html', post.main_text.ru, callback);
		},
		main_text_en: function(callback) {
			if (!post.main_text.en) return callback(null);

			fs.writeFile(__app_root + '/static/main_text_en.html', post.main_text.en, callback);
		},
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