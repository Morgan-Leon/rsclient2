Rs.engine({
	
	shell : 'window',
	
	onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
	stateful: true,
    
    stateId: 'hi_app2',
    
    stateEvents: ['appmove', 'appresize'],
	
    libraries : ['ext-3.3.1'],
    
    apps : [{
        folder : 'treePanel',
        name : '总账科目树',
        autoRun : true,
        region : {
            x : 100,
            y : 50,
            width : 300,
            height : 400,
            maxWidth : 400,
            maxHeight : 500,
            collapsible : true,
            minimizable : true,
            maximizable : true,
            modal : false
        }
    }, {
        folder : 'gridPanel',
        name : '子项科目列表',
        autoRun : false,
        region : {
            x : 500,
            y : 50,
    		width : 600,
    		height : 500,
    		maxWidth : 900,
			maxHeight : 900,
    		minimizable : true,
			maximizable : true,
			modal : false
    	}
    }]
});
