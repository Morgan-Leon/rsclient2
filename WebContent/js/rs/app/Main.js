Rs.define('Rs.app.Resizable', {

	setWidth : function() {
		Rs.error('必须实现setWidth方法!');
	},

	setHeight : function() {
		Rs.error('必须实现setHeight方法!');
	}

});


/**
 * @class Rs.app.Main
 * 应用程序的通用入口类，使用方法,在应用程序中配置mixins参数
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
		Rs.error('必须实现render方法!');
	}

});
