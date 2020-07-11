var express = require('express');
var multer = require('multer');

var upload = multer({ dest: __glob_root + '/uploads/' });

var admin = {
	main: require('./main.js'),
	events: require('./events/_events.js'),
	places: require('./places/_places.js'),
	programs: require('./programs/_programs.js'),
	members: require('./members/_members.js'),
	partners: require('./partners/_partners.js'),
	posts: require('./posts/_posts.js'),
	users: require('./users/_users.js'),
	options: require('./options.js')
};

var checkAuth = function(req, res, next) {
	req.session.user_id
		? next()
		: res.redirect('/auth');
};

module.exports = (function() {
	var router = express.Router();

	router.route('/').get(checkAuth, admin.main.index);

	router.use('/events', checkAuth, upload.fields([ { name: 'poster' }, { name: 'poster_hover' } ]), admin.events);
	router.use('/places', checkAuth, admin.places);
	router.use('/programs', checkAuth, upload.fields([ { name: 'poster' }, { name: 'cover' } ]), admin.programs);
	router.use('/members', checkAuth, upload.fields([ { name: 'photo' } ]), admin.members);
	router.use('/partners', checkAuth, upload.fields([ { name: 'logo' } ]), admin.partners);
	router.use('/posts', checkAuth, upload.fields([ { name: 'poster' }, { name: 'cover' } ]), admin.posts);
	router.use('/users', checkAuth, admin.users);

	router.post('/preview', checkAuth, upload.single('image'), admin.options.preview);

	router.get('/dump', checkAuth, admin.options.dump);

	return router;
})();