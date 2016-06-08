Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine( {

    shell : {
        type : 'window',
        taskBarPosition : 'south'
    },
    
    environment : 'development', //��������
    
    stateful : true,
    
    stateId : 'app_windowApp',

    stateEvents : ['themechange', 'install', 'appmove', 'appresize' ],
    
    libraries : [ 'ext-3.3.1' ],
    
    apps : [ {
        folder : 'appStore',
        name : 'Ӧ�ó���',
        autoRun : true,
        region : {
            x : 200,
            y : 0,
            width : 400,
            height : 300
        }
    }, {
        folder : 'multiApp',
        name : '���Ӧ�ó������',
        autoRun : false,
        region : {
            x : 100,
            y : 50,
            width : 500,
            height : 400
        }
    }, {
        folder : 'allInOne',
        name : '���˿�Ŀ����',
        autoRun : false,
        region : {
            x : 300,
            y : 50,
            width : 500,
            height : 400
        }
    }, {
        folder : 'eventLogger',
        name : 'ϵͳ������־',
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

