Rs.define('rs.panel.Panel', {

	constructor : function(config) {
		config = Rs.apply(config || {}, {
			html : 'Ãæ°å'
		});
		Rs.apply(this, config);
	},

	render : function(domEl) {
		var ct = this.ct = Rs.get(domEl);
		ct.update(this.html);
		ct.setStyle('background-color', 'pink');
	},

	setWidth : function(w) {
		this.ct.setWidth(w);
	},

	setHeight : function(h) {
		this.ct.setHeight(h);
	}

});