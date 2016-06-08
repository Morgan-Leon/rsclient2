Rs.engine({
    
    shell : 'window',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    theme : 'blue',
    
    libraries : ['ext-3.3.1'],
    
    apps : [{
        folder : 'layoutpanel',
        autoRun : true,
        name : '布局选择',
        region : {
            x : 0,
            y : 0,
            width : 1024,
            height : 768
        }
    },{
		id : "2" ,
        folder : 'style2',
        autoRun : false,
        name : '样式2',
        region : {
            x : 0,
            y : 0,
            width : 1024,
            height : 768
        }
    }]
});