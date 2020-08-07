

module.exports = function(Model) {
	var module = {};

	var Program = Model.Program;

	module.index = function(req, res, next) {
		Program.find({'members': {'$not': {'$size': 0}}}).populate('members').where('status').ne('hidden').sort('-date').exec(function(err, programs) {
			if (err) return next(err);

			res.render('main/jury.pug', { programs: programs });
		});
	};

	return module;
};