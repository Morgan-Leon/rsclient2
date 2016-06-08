Ext.QuickTips.init();
R = function(){
	
	var fc, fps = {};
	var search = window.location.search; 
	if(Ext.isEmpty(search, false) == false){
		search = search.substring(1);
		var ps = search.split('&');
		Ext.each(ps, function(p){
			var kv = p.split('=');
			if(kv && kv.length == 2){
				if(kv[0] == 'formCode'){
					fc = kv[1];
				}else {
					fps[kv[0]] = kv[1];
				}
			}
		}, this);
	}
	return {
		js : [
		    '../generalform/CardPanel.js',
		    '../generalform/Model.js',
		    'GeneralCardPanel.js'
	    ],
		objCfg : {
			clazz : 'Rs.ext.app.GeneralCardPanel',
			cfg : {
				formCode : fc,
				formParams : fps,
				dataServiceUrl : '/rsc/js/examples/app/cardpanel/generalcardpanel/dataservice.rsc'
			}
		}
	}
}();
