var $window = $(window);
var $document = $(document);
var context = { skip: 0, limit: 10 };

$(function() {
	var scrollLoader = function(e) {
		if ($window.scrollTop() + $window.height() + 240 >= $document.height()) {
			$window.off('scroll');

			$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
				if (data !== 'end') {

					$('.news_posts').append(data);

					context.skip += 10;
					$window.on('scroll', scrollLoader);
				} else {
					$('.news_more').addClass('hide');
				}
			});
		}
	};

	$window.on('scroll', scrollLoader).trigger('scroll');
});