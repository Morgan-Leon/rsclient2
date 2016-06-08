Rs.engine({

    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    environment : {
        type : 'development',
        config : {
            //clearCache : false ,
            monitor: false
        }
    },

    libraries: ['ext-3.3.1-debug'],

    apps: [{
    	autoRun : true ,
        folder: '../bomdefinetree',
        name: "物料清单定义树",
        region: {
            rid : 'center'
        }
    }]
});