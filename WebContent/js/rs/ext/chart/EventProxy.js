Ext.namespace('Rs.ext.chart');

Rs.ext.chart.EventProxy = {
	
	keys:[],
	
	registerParameter : function(key){
		this.keys.push(key);
		return this.keys.length-1;
	},
	
	getParameter : function(id){
		return this.keys[id];
	},
	
	callback : function(keyId){
		var params = this.getParameter(keyId);
		var chart = params.chart;
		var arr = {};
		for(var p in params){
			if(p != 'chart'){
				arr[p] = params[p];
			}
		}
		(function(){
			chart[params.callback](arr);
		}).defer(10);
	}
	
};