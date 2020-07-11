$(function() {
	$('form').on('submit', function(e) {
		e.preventDefault();

		// -- Schedule

		$('.block_item.schedule').not('.hidden').toArray().forEach(function(schedule, i) {
			$('<input />').attr('type', 'hidden')
										.attr('name', 'schedule' + '[' + i + ']' + '[date]')
										.attr('value', $(schedule).find('.date').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'schedule' + '[' + i + ']' + '[time][hours]')
										.attr('value', $(schedule).find('.hours').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'schedule' + '[' + i + ']' + '[time][minutes]')
										.attr('value', $(schedule).find('.minutes').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'schedule' + '[' + i + ']' + '[premiere]')
										.attr('value', $(schedule).find('.premiere').is(':checked'))
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'schedule' + '[' + i + ']' + '[link]')
										.attr('value', $(schedule).find('.ext_link').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'schedule' + '[' + i + ']' + '[options]')
										.attr('value', $(schedule).find('.date_options').val())
										.appendTo('form');

		});

		// -- Members

		$('.block_item.group').not('.hidden').toArray().forEach(function(group, i) {
			$('<input />').attr('type', 'hidden')
										.attr('name', 'members' + '[' + i + ']' + '[mode]')
										.attr('value', $(group).find('.group_mode').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'members' + '[' + i + ']' + '[title][ru]')
										.attr('value', $(group).find('.ru').val())
										.appendTo('form');

			$('<input />').attr('type', 'hidden')
										.attr('name', 'members' + '[' + i + ']' + '[title][en]')
										.attr('value', $(group).find('.en').val())
										.appendTo('form');

			$(group).find('.list_item').toArray().forEach(function(item, j) {
				$('<input />').attr('type', 'hidden')
											.attr('name', 'members' + '[' + i + ']' + '[list][' + j + ']')
											.attr('value', $(item).children('select').val())
											.appendTo('form');
			});
		});

		// -- Partners

		$('.block_item.partners').not('.hidden').toArray().forEach(function(partners, i) {
			$('<input />').attr('type', 'hidden')
										.attr('name', 'partners' + '[' + i + ']')
										.attr('value', $(partners).find('.partner_item').val())
										.appendTo('form');
		});


		this.submit();
	});
});