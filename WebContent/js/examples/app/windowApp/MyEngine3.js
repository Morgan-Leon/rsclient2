Rs.BASE_PATH = '/rsc/js/rs';

Rs.engine( {

    shell : 'tab',

    libraries : [ 'ext-3.3.1-debug' ],

    //environment : 'development', //开发环境

    stateful : true,

    stateId : 'app_border_app3',

    stateEvents : [ 'install', 'appmove', 'appresize' ],

    apps : [ {
        folder : 'acctTree',//总账科目树
        autoRun : true,
        region : 'tab'
    }, {
        folder : 'acctCreate',//新增子科目
        autoRun : true,
        region : 'tab'
    },{
        folder : 'acctGrid',//表格
        autoRun : true,
        region : 'tab'
    }/*, {
        folder : 'BUILDINS/theme',
        autoRun : true,
        region : {
            x : 100,
            y : 100,
            width : 400,
            height : 300
        }
    } */]

});
