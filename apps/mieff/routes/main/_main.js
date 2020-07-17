var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	events: require('./events.js')(Model),
	posts: require('./posts.js')(Model),
	program: require('./program.js')(Model),
	members: require('./members.js')(Model),
	partners: require('./partners.js')(Model),
	options: require('./options.js')(Model),
	tickets: require('./tickets.js')(Model),
	static: require('./static.js'),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index)

	router.route('/events')
		.get(main.events.index);

	router.route('/events/:short_id')
		.get(main.events.event);

	router.route('/program')
		.get(main.program.index);

	router.route('/about')
		.get(main.static.about);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/widget')
		.get(main.tickets.widget);

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();