Rs.define('rs.panel.BluePanel', {

	extend : rs.panel.Panel,

	mixins : [ Rs.app.Main ],

	render : function(domEl) {
		var ct = this.ct = Rs.get(domEl);
		ct.update(this.html);
		ct.setStyle('background-color', 'blue');
	}

});