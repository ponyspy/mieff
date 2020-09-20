$(function() {
	$('.submit_button').on('click', function() {
		if ($('.confirm_check').is(':checked')) {
			$('form.main').submit();
		}
	});
});