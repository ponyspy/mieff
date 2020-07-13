var sitemap = require('sitemap');
var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Member = Model.Member;
	var Post = Model.Post;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.search = function(req, res, next) {
		Member.find({ $text: { $search: req.body.text } }).where('status').nin(['hidden', 'special']).exec(function(err, members) {
			var members_ids = members.map(function(member) {
				return member._id.toString();
			});

			var query = members_ids && members_ids.length > 0
				? { $or: [{ $text: { $search: req.body.text } }, { 'members.list': { $in: members_ids } }] }
				: { $text: { $search: req.body.text } }

			Event.find(query, { score: { $meta: 'textScore' } }).where('status').ne('hidden').sort( { score: { $meta: 'textScore' } } ).exec(function(err, events) {

				Post.find({ $text: { $search: req.body.text } }).exec(function(err, posts) {

					var opts = {
						__: function() { return res.locals.__.apply(null, arguments); },
						__n: function() { return res.locals.__n.apply(null, arguments); },
						get_locale: get_locale,
						members: members,
						events: events,
						posts: posts,
						static_types: req.app.locals.static_types,
						locale: req.locale,
						compileDebug: false, debug: false, cache: false, pretty: false
					};

					res.send(pug.renderFile(__app_root + '/views/main/_search.pug', opts));
				});
			});
		});
	};

	module.sitemap = function(req, res, next) {

		Event.where('status').ne('hidden').exec(function(err, events) {

			var links = [
				{ url: '/' },
				{ url: '/team' },
				{ url: '/contacts' },
				{ url: '/about' },
			];

			var stream = new sitemap.SitemapStream({ hostname: 'https://' + req.hostname });

			stream.pipe(res);
			res.type('xml');

			links.forEach(function(link) {
				return stream.write(link);
			});

			events.forEach(function(event) {
				return stream.write({
					url: '/events/' + (event.sym ? event.sym : event._short_id)
				});
			});

			stream.end();

			stream.on('error', function(err) {
				return next(err);
			});

			stream.on('data', function(chunk) {
				res.write(data);
			});

			stream.on('end', function() {
				res.end();
			});

		});

	};


	return module;
};