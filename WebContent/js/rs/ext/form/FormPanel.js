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
		 * 默认值为load
		 * @cfg {String} loadMethod 
		 */
		loadMethod : 'load',
		
		/**
		 * 提交到后台的业务方法名称，默认的方法名称是submit
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
