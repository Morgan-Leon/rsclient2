Ext.QuickTips.init();
R = function(){
	
	return {
		css : ['css/main.css'],
		js : [
		    '../generalform/CardPanel.js',
			'../generalform/Model.js',
	        'GeneralModelColumnPanel.js',
			'GeneralModelMainPanel.js'
	    ],
		objCfg : {
			clazz : 'rs.pub.GeneralModelMainPanel'
		}
	}
}();
