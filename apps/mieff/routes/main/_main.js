var express = require('express');

var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	events: require('./events.js')(Model),
	posts: require('./posts.js')(Model),
	programs: require('./programs.js')(Model),
	members: require('./members.js')(Model),
	partners: require('./partners.js')(Model),
	options: require('./options.js')(Model),
	static: require('./static.js')(Model),
};

module.exports = (function() {
	var router = express.Router();

	router.route('/')
		.get(main.index.index)
		.post(main.index.get_events);

	router.route('/events')
		.get(main.events.index);

	router.route('/events/:short_id')
		.get(main.events.event);

	router.route('/partners')
		.get(main.partners.index);

	router.route('/members/:short_id')
		.get(main.members.member);

	router.route('/program')
		.get(main.programs.index)
		.post(main.programs.get_events);

	router.route('/program/:short_id')
		.get(main.programs.program)
		.post(main.programs.get_events);

	router.route('/about')
		.get(main.static.about);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();