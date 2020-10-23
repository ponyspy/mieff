var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });


var Model = require(__glob_root + '/models/main.js');

var main = {
	index: require('./index.js')(Model),
	events: require('./events.js')(Model),
	posts: require('./posts.js')(Model),
	programs: require('./programs.js')(Model),
	jury: require('./jury.js')(Model),
	members: require('./members.js')(Model),
	opencall: require('./opencall.js')(Model),
	partners: require('./partners.js')(Model),
	options: require('./options.js')(Model),
	static: require('./static.js')(Model),
};

module.exports = (function() {
	var router = express.Router();

	router.use(main.partners.special)

	router.route('/')
		.get(main.index.index)
		.post(main.index.get_events);

	router.route('/news')
		.get(main.posts.index)
		.post(main.posts.get_posts);

	router.route('/news/:short_id')
		.get(main.posts.post);

	router.route('/events')
		.get(main.events.index);

	router.route('/events/:short_id')
		.get(main.events.event);

	router.route('/partners')
		.get(main.partners.index);

	router.route('/jury')
		.get(main.jury.index);

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

	router.route('/opencall')
		.get(main.opencall.index)

	router.route('/opencall/application')
		.get(main.opencall.application)
		.post(upload.fields([ { name: 'cv' }, { name: 'portfolio' } ]), main.opencall.form);

	router.route('/lang/:locale').get(function(req, res) {
		res.cookie('locale', req.params.locale);
		res.redirect('back');
	});

	router.route('/sitemap.xml')
		.get(main.options.sitemap);

	return router;
})();