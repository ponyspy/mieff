module.exports = function(Model) {
	var module = {};

	module.index = function(req, res) {
		res.render('main/index.pug');
	};

	return module;
};