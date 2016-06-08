Rs.engine({
    
    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        //folder : 'q2',
        folder : 'queryPanel',
        name : '≤È—Ø“≥√Ê',
        autoRun : true,
        region : {
            rid:'center',
            x : 300,
            y : 200,
            width : 600,
            height : 400
        }
    }]
});