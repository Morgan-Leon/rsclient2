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
		 * ���͸�������ʱ,�Ƿ��������Զ����͵���̨,Ĭ��ֵΪfalse
		 * </p>
		 */
		writeAllFields : false,
		
		encodeDelete : true,
		
		/**
		 * <p>
		 * ��дJsonWriter��render������
		 * 1 ���͵���̨�����ݲ����б���,����Ϊparams�����Է��͵���̨.
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