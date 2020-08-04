$(function() {

	$('.menu_drop').on('click', function(e) {
		$('body').toggleClass('stop_scroll');
		$('.title_block, .menu_drop').toggleClass('open');
	});

	$(document)
		.on('mouseup touchend', function(e) {
			if ($(e.target).closest('.widget_inner').length) return;

			if ($('.widget_block').hasClass('open')) {
				$('body').removeClass('stop_scroll');
				$('.widget_block').removeClass('open').children('.widget_inner').empty();
			}

			e.stopPropagation();
		})


	$(document).on('click', '.buy_open', function(e) {
		e.preventDefault();

		var $this = $(this);

		if ($this.hasClass('link')) {

			window.open($this.attr('data-src'), '_blank');

		} else if ($this.hasClass('widget')) {

			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				window.open($this.attr('data-src'), '_blank');
				return false;
			}

			$('body').addClass('stop_scroll');

			var $frame = $('<iframe>', {
				src: $this.attr('data-src'),
				id: 'pn_widget',
				frameborder: 0,
				scrolling: 'yes'
			}).one('load', function(e) {
				$('#pn_widget').addClass('show');
			});

			$('.widget_block').children('.widget_inner').empty().append($frame).end().addClass('open');

		} else return false;
	});


});