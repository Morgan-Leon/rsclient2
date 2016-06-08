Rs.engine({
    
    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    //libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'm5_2',
        id : 'gridwithaddlinepanel',
        clearCache : true,
        region : {
            rid : 'center'
        }
    }, {
        folder : 'm5_1',
        id : 'addlinepanel',
        clearCache : true,
        region : {
            rid : 'south',
            height : 220,
            collapsible : true
        }
    }]
});