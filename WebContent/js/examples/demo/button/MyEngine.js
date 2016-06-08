Rs.engine({
    shell : 'border',
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    environment : {
        type : 'development',
        config : {
            //clearCache : false ,
            monitor : false
        }
    },
    libraries : ['ext-3.3.1-debug'],
    apps : [{
                folder : '.',
                name : "°´Å¥Demo",
                autoRun : false,
                region : {
                    rid : 'center'
                }
            }]
});