var querystring = require('querystring');
var request = require('request');
var moment = require('moment');


module.exports = function() {
	var module = {};

	var validateEmail = function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	};

	module.widget = function(req, res, next) {
		if (req.query.show_id) {
			var uri = req.app.locals.static_keys.intickets_widget_uri;

			res.redirect(uri + '/node/' + req.query.show_id);
		} else if (req.query.link_src) {
			res.redirect(req.query.link_src);
		}
	};

	module.mailer = function(req, res, next) {
		var date = moment(req.body.year + '-' + ('0' + req.body.month).slice(-2) + '-' + ('0' + req.body.date).slice(-2), 'YYYY-MM-DD', true);
		if (!validateEmail(req.body.email)) return res.send('email');

		var options_auth = {
			url: req.app.locals.static_keys.sendpulse_api_uri + '/oauth/access_token',
			form: {
				'grant_type': 'client_credentials',
				'client_id': req.app.locals.static_keys.sendpulse_id,
				'client_secret': req.app.locals.static_keys.sendpulse_secret
			},
			timeout: 6000,
			json: true
		};

		var options_email = {
			url: req.app.locals.static_keys.sendpulse_api_uri + '/addressbooks/' + req.app.locals.static_keys.sendpulse_adressbook_id + '/emails',
			form: {
				'emails': [{
					"email": req.body.email,
					"variables": {
						'name': req.body.name,
						'birthday': date.isValid() ? date.format('YYYY-MM-DD') : undefined
					}
				}]
			},
			timeout: 6000,
			json: true
		};

		request.post(options_auth, function(err, resp, body) {
			if (err || body.error_code) return res.send('err');

			options_email['headers'] = { 'Authorization': 'Bearer ' + body.access_token };

			request.post(options_email, function(err, resp, body) {
				if (err || body.error_code) return res.send('err');

				res.send('ok');
			});
		});
	};


	return module;
};