Rs.BASE_PATH = '/rsc/js/rs';

Rs.engine( {

    shell : 'border', 
    
    libraries : [ 'ext-3.3.1' ],
    
    environment : 'development', //开发环境
    
    stateful: true,
    
    stateId: 'app_border_app2',
    
    stateEvents: ['install', 'appmove', 'appresize'],
    
    apps : [{
        folder : 'acctTree',
        region : {
            rid : 'west',
            width : 250,
            collapsible : true
        }
    }, {
        folder : 'acctGrid',
        region : 'center'
    }, {
        folder : 'acctCreate',
        region : {
            rid : 'east',
            width : 320,
            height:300,
            collapsible : true
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
