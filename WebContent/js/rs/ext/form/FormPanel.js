Ext.ns("Rs.ext.form");

(function(){
	
	/**
	 * @class Rs.ext.form.FormPanel
	 * @extends Ext.form.FormPanel
	 * @constructor
	 * @param {Object} config Configuration options
	 * @xtype rs-ext-formpanel
	 */
	Rs.ext.form.FormPanel = function(){
		Rs.ext.form.FormPanel.superclass.constructor.apply(this, arguments);
	}; 
		
	Ext.extend(Rs.ext.form.FormPanel, Ext.form.FormPanel, {

		/**
		 * Ĭ��ֵΪload
		 * @cfg {String} loadMethod 
		 */
		loadMethod : 'load',
		
		/**
		 * �ύ����̨��ҵ�񷽷����ƣ�Ĭ�ϵķ���������submit
		 * 
		 * @cfg {String} submitMethod 
		 */
		submitMethod : 'submit',
		
		// private
	    createForm : function(){
	        var config = Ext.applyIf({listeners: {}}, this.initialConfig);
	        return new Rs.ext.form.BasicForm(null, config);
	    }

	});
	Ext.reg('rs-ext-formpanel', Rs.ext.form.FormPanel);

})();
