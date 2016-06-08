Rs.engine({
	
	shell : {
        type : 'border',
        north : {
            height : 120
        },
        east : {
            width : 200
        },
        west : {
            width : 200
        },
        south : {
            height : 300
        }
    },
	
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
	libraries : ['ext-3.3.1'],
    
	stateful: true,
	
	stateId: 'hi_app',
    
    stateEvents: ['appmove', 'appresize'],
	
    apps : [{
        region: 'center',
        folder : 'center'
    }, {
        folder : 'north',
        region : {
    		rid : 'north',
    		collapsible : true
    	}
    }, {
        folder : 'south',
        autoRun : false,
        region : {
    		rid : 'south',
    		collapsible : true
    	}
    }, {
	    folder : 'west',
	    autoRun : false,
	    region : {
    		rid : 'west',
    		collapsible : true
    	}
	}, {
	    region: 'east',
	    folder : 'east'
	}, {
	    folder : 'window',
	    region : {
			x : 10,
			y : 20,
			width : 600,
			height : 500,
    		maxWidth : 800,
			maxHeight : 800,
			minimizable : true,
			maximizable : true,
			closable : true,
			modal : true,
			hidden : true
		}
	}, {
	    folder : 'window2',
	    region : {
			x : 100,
			y : 20,	
			width : 600,
			height : 500,
    		maxWidth : 800,
			maxHeight : 800,
			minimizable : true,
			maximizable : true,
			closable : true,
			resizable : true,
			modal : false,
			hidden : true
		}
	}, {
	    folder : 'window2',
	    id : 'mywindow3',
	    name : '第三个窗口',
	    region : {
			x : 150,
			y : 20,
			width : 600,
			height : 500,
    		maxWidth : 800,
			maxHeight : 800,
			minimizable : true,
			maximizable : true,
			closable : true,
			resizable : true,
			modal : false,
			hidden : true //窗口隐藏
		}
	}]
});
