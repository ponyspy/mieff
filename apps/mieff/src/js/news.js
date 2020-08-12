var $window = $(window);
var $document = $(document);
var context = { skip: 0, limit: 30 };

$(function() {
	var scrollLoader = function(e) {
		if ($window.scrollTop() + $window.height() + 240 >= $document.height()) {
			$window.off('scroll');

			$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
				if (data !== 'end') {

					var $posts = $(data);
					var years = [];

					$posts.each(function() {
						var $post = $(this);
						var last_year = $('.post_item').last().attr('data-year');

						if ($post.attr('data-year') !== last_year && years.indexOf(last_year) == -1) {
							years.push(last_year);

							$date_title = $('<div/>', {'class': 'date_title', 'text': $post.attr('data-year')});
							$date_title.appendTo('.news_posts');
						}

						$post.appendTo('.news_posts');
					});

					context.skip += 30;
					$window.on('scroll', scrollLoader);
				}
			});
		}
	};

	$window.on('scroll', scrollLoader).trigger('scroll');
});