$(function() {

	var swiper = new Swiper('.swiper-container', {
		loop: true,
		effect: 'fade',
		keyboard: {
			enabled: true
		},
		pagination: {
			clickable: true,
			el: '.swiper-pagination',
		}
	});

	$('.cover_item').on('click', function(e) {
		swiper.slideNext();
	});

});