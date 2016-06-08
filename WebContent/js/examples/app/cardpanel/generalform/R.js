Ext.QuickTips.init();
R = function(){
	
	return {
		css : ['css/main.css'],
		js : [
		    'CardPanel.js',
		    'Model.js',
	        'GeneralFormMainPanel.js',
		    'GeneralFormRegionPanel.js',
		    'GeneralFormFieldLinePanel.js',
		    'GeneralFormPreviewPanel.js',
		    'GeneralFormActionsPanel.js'
	    ],
		objCfg : {
			clazz : 'rs.pub.GeneralFormMainPanel'
		}
	}
}();
