Rs.engine({
    
    shell : 'window',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    theme : 'blue',
    
    libraries : ['ext-3.3.1'],
    
    apps : [{
        folder : 'addPanel',
        name : "新增面板",
        autoRun : true,
        region : {
            x : 10,
            y : 100,
            width : 350,
            height : 300
        }
    }, {
        folder : 'panel',
        name : '普通面板',
        autoRun : true,
        region : {
            x : 360,
            y : 100,
            width : 350,
            height : 300
        }
    }, {
        folder : 'formPanel', 
        autoRun : true,
        name : '邮件面板',
        region : {
            x : 710,
            y : 100,
            width : 350,
            height : 300
        }
    }, {
        folder : 'phonePanel',
        autoRun : true,
        name : '手机',
        region : {
            x : 100,
            y : 100,
            width : 800,
            height : 600
        }
    }]
});