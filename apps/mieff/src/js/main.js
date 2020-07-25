$(document).ready(function() {
	var context = {};

	var macyInstance = Macy({
		container: '.program_events',
		trueOrder: false,
		waitForImages: false,
		margin: 25,
		columns: 4,
	});

	$(document).on('events_load', function(e) {
		$.post('', {'context': context}).done(function(data) {
			$('.program_events').empty().append(data);

			macyInstance.runOnImageLoad(function() {
			  macyInstance.recalculate(true);
			}, true);
		});
	}).trigger('events_load');


	$(document).on('click', '.nav_item, .nav_all', function(e) {
		var $this = $(this);
		var type = $this.closest('.nav_column').attr('class').split(' ')[1];

		$this.hasClass('nav_item')
			? $this.toggleClass('active')
			: $this.closest('.nav_column').find('.nav_item').removeClass('active');

		$this.closest('.nav_column').find('.nav_item.active').length !== 0
			 ? $this.closest('.nav_column').find('.nav_all').addClass('active')
			 : $this.closest('.nav_column').find('.nav_all').removeClass('active')

		context[type] = $this.parent().find('.active').map(function() {
			return $(this).attr('data-val');
		}).toArray();

		$(document).trigger('events_load');
	});

});