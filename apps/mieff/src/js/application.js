$(function() {
	$('.submit_button').on('click', function(e) {
		if ($(this).hasClass('active')) {
			$('form.main').submit();
		}
	});

	$('.confirm_check').on('change', function(e) {
		$('.submit_button').toggleClass('active');
	});
});