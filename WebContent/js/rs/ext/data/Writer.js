Ext.ns("Rs.ext.data");

(function(){
	/**
	 * @class Rs.ext.data.Writer
	 * @extends Ext.data.JsonWriter
	 */
	Rs.ext.data.Writer = function(){
		Rs.ext.data.Writer.superclass.constructor.apply(this, arguments);
	};
	
	Ext.extend(Rs.ext.data.Writer, Ext.data.JsonWriter, {
		
		/**
		 * @cfg {Boolean} writerAllFields 
		 * <p>
		 * 发送更新请求时,是否将所有属性都发送到后台,默认值为false
		 * </p>
		 */
		writeAllFields : false,
		
		encodeDelete : true,
		
		/**
		 * <p>
		 * 重写JsonWriter的render方法，
		 * 1 发送到后台的数据不进行编码,并作为params的属性发送到后台.
		 * </p>
		 * @param {Object} params
		 * @param {Object} baseParams
		 * @param {Object} data
		 */
		render : function(params, baseParams, data) {
			Ext.apply(params, baseParams);
			params[this.meta.root] = data;
    	}
	});
	
})();