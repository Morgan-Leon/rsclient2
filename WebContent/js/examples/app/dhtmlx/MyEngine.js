Rs.engine({
    
    shell : 'border',

    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    libraries : ['ext-3.3.1-debug'],
    
    enviroment : {type : 'development',
        clearCache : true},
    
    apps : [{
        folder : 'grid',
        name:"dhtmlx±í¸ñ",
        region : {
            rid : 'center'
        }
    }]
});