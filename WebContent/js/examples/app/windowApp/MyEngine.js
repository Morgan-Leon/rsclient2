Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine( {

    shell : {
        type : 'window',
        taskBarPosition : 'south'
    },
    
    environment : 'development', //开发环境
    
    stateful : true,
    
    stateId : 'app_windowApp',

    stateEvents : ['themechange', 'install', 'appmove', 'appresize' ],
    
    libraries : [ 'ext-3.3.1' ],
    
    apps : [ {
        folder : 'appStore',
        name : '应用程序',
        autoRun : true,
        region : {
            x : 200,
            y : 0,
            width : 400,
            height : 300
        }
    }, {
        folder : 'multiApp',
        name : '多个应用程序组合',
        autoRun : false,
        region : {
            x : 100,
            y : 50,
            width : 500,
            height : 400
        }
    }, {
        folder : 'allInOne',
        name : '总账科目定义',
        autoRun : false,
        region : {
            x : 300,
            y : 50,
            width : 500,
            height : 400
        }
    }, {
        folder : 'eventLogger',
        name : '系统操作日志',
        autoRun : false,
        region : {
            x : 800,
            y : 50,
            width : 250,
            height : 450
        }
    }, {
        folder : 'BUILDINS/theme',
        autoRun : true,
        region : {
            x : 100,
            y : 100,
            width : 400,
            height : 300
        }
    }]

});

