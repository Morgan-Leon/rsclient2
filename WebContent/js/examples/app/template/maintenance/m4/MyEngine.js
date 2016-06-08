Rs.engine({
    
    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    //libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'm4_2',
        id : 'withaddpanel',
        region : 'center',
        clearCache : true
    }, {
        folder : 'm4_1',
        id : 'buildinaddpanel',
        clearCache : true,
        region : {
            rid : 'east',
            width : 220,
            collapsible : true
        }
    }]
});