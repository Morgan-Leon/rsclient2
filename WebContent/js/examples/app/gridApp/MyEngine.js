Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine( {

    shell : 'border',

    onBeforeInitialize : function() {
        
    },

    //theme : 'black',
    
    //设置程序运行环境
    environment : {
        type : 'development', //开发环境
        config : {
            monitor : true, //启动监视器
            interval : 1000 //监视器更新频率
        }
    },
    
    libraries : [ 'ext-3.3.1' ],
    
    apps : [ {
        folder : 'gridApp',
        region : {
            rid : 'center',
            height : 200,
            collapsible : true,
            collapsed : false
        }
    }]
});