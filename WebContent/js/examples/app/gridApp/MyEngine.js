Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine( {

    shell : 'border',

    onBeforeInitialize : function() {
        
    },

    //theme : 'black',
    
    //���ó������л���
    environment : {
        type : 'development', //��������
        config : {
            monitor : true, //����������
            interval : 1000 //����������Ƶ��
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