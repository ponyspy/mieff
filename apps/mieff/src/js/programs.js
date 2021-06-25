$(document).ready(function() {
	var context = {};

	$.post('', {'context': context}).done(function(data) {

		var $data = $(data);

		$('.program_body').empty().append($data);

		$data.each(function() {
			var macyInstance = Macy({
				container: $(this).find('.program_events')[0],
				trueOrder: false,
				waitForImages: false,
				margin: 25,
				columns: 4,
				breakAt: {
					1200: {
						// margin: { x: 20, y: 10 },
						columns: 3
					},
					900: {
						// margin: { x: 20, y: 10 },
						columns: 2
					},
					700: {
						// margin: { x: 20, y: 10 },
						columns: 1
					}
				}
			});

			macyInstance.runOnImageLoad(function() {
				macyInstance.recalculate(true);
			}, true);

		});
	});

});