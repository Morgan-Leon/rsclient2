Rs.onReady(function() {
	Rs.select('.tab-buttons-panel').on('click', function(e, t) {
		Rs.fly(t).radioClass('tab-show');
		Rs.get('content' + t.id.slice(-1)).radioClass('tab-content-show');
	}, null, { delegate : 'li'
	});
});