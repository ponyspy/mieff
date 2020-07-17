var sitemap = require('sitemap');
var pug = require('pug');

module.exports = function(Model) {
	var module = {};

	var Event = Model.Event;
	var Member = Model.Member;
	var Post = Model.Post;

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