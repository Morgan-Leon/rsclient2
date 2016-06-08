Rs.define('Rs.app.Resizable', {

	setWidth : function() {
		Rs.error('����ʵ��setWidth����!');
	},

	setHeight : function() {
		Rs.error('����ʵ��setHeight����!');
	}

});


/**
 * @class Rs.app.Main
 * Ӧ�ó����ͨ������࣬ʹ�÷���,��Ӧ�ó���������mixins����
 * <pre><code>
      mixins : [ Rs.app.Main ],
 * </code></pre>
 */
Rs.define('Rs.app.Main', {
    //private
	mixins : [ Rs.app.Resizable ],

	main : function(engine, region) {
        this.render.defer(15,this,[region.getRawEl()]);
        this.region = region;
		this.region.addResizeListener(function(w, h) {
			this.setWidth(w);
			this.setHeight(h);
		}, this);
	},

	render : function() {
		Rs.error('����ʵ��render����!');
	}

});
