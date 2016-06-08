Rs.BASE_PATH = '/rsc/js/rs';

Rs.engine( {

    shell : 'tab',

    libraries : [ 'ext-3.3.1-debug' ],

    //environment : 'development', //��������

    stateful : true,

    stateId : 'app_border_app3',

    stateEvents : [ 'install', 'appmove', 'appresize' ],

    apps : [ {
        folder : 'acctTree',//���˿�Ŀ��
        autoRun : true,
        region : 'tab'
    }, {
        folder : 'acctCreate',//�����ӿ�Ŀ
        autoRun : true,
        region : 'tab'
    },{
        folder : 'acctGrid',//���
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
