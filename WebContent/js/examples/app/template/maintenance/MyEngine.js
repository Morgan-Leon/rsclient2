Rs.engine({
    
    shell : 'window',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'm1',
        name : '维成员定义',
        autoRun : true,
        clearCache : true,
        region : {
            x : 10,
            y : 100,
            width : 800,
            height : 400
        }
    }, {
        folder : 'm3',
        name:"带弹出式新增面板的维护页面",
        autoRun:false,
        clearCache : true,
        region : {
            x : 510,
            y : 100,
            width : 500,
            height : 300
        }
    }, {
        folder : 'm2',
        name : '带新增行的维护页面',
        autoRun : false,
        clearCache : true,
        region : {
            x : 10,
            y : 450,
            width : 500,
            height : 400
        }
    }, {
        folder : 'm4',
        name : '带新增面板的维护页面',
        autoRun : false,
        clearCache : true,
        region : {
            x : 10,
            y : 450,
            width : 600,
            height : 300
        }
    }, {
        folder : 'm5',
        name : '带新增行面板的维护页面',
        autoRun : false,
        clearCache : true,
        region : {
            x : 10,
            y : 450,
            width : 600,
            height : 600
        }
    }]
});