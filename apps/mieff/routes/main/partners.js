module.exports = function(Model) {
	var module = {};

	var Partner = Model.Partner;

	var get_locale = function(option, lg) {
		return ((option.filter(function(locale) {
			return locale.lg == lg;
		})[0] || {}).value || '');
	};

	module.index = function(req, res) {
		Partner.aggregate([
			{ $match: { 'status': {
				$nin: ['hidden']
			}}},
			{ $sort: { 'date': -1 } },
			{ $group: {
				_id: '$type',
				partners: {
					$push: '$$ROOT'
			}}},
			{ $project: {
				_id: 0,
				'type': '$_id',
				'partners': '$partners'
			}}
		]).exec(function(err, types) {
			var actual_types = req.app.locals.static_types.partners_types;

			types.sort(function(a, b) {
				return actual_types.indexOf(a.type) - actual_types.indexOf(b.type);
			});

			res.render('main/partners.pug', { types: types, get_locale: get_locale, locale: req.locale });
		});
	};

	module.special = function(req, res, next) {
		Partner.aggregate([
			{ $match: { 'status': {
				$in: ['special']
			}}},
			{ $sort: { 'date': -1 } },
			{ $group: {
				_id: '$type',
				partners: {
					$push: '$$ROOT'
			}}},
			{ $project: {
				_id: 0,
				'type': '$_id',
				'partners': '$partners'
			}}
		]).exec(function(err, types) {
			if (req.url == '/partners') return next();

			var actual_types = req.app.locals.static_types.partners_types;

			types.sort(function(a, b) {
				return actual_types.indexOf(a.type) - actual_types.indexOf(b.type);
			});

			res.locals.special_partners = { types: types, get_locale: get_locale, locale: req.locale };

			next();
		});
	};


	return module;
};