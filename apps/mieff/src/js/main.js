$(document).ready(function() {

	var macyInstance = Macy({
		container: '.program_events',
		trueOrder: false,
		waitForImages: false,
		margin: 25,
		columns: 4,
	});

	$(document).on('events_load', function() {
		$.post('').done(function(data) {
			$('.program_events').append(data);

			macyInstance.runOnImageLoad(function() {
			  macyInstance.recalculate(true);
			}, true);
		});
	}).trigger('events_load');

});