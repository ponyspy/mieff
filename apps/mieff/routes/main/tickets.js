var querystring = require('querystring');
var request = require('request');
var moment = require('moment');


module.exports = function() {
	var module = {};

	module.widget = function(req, res, next) {
		res.redirect(req.query.link_src);
	};

	return module;
};