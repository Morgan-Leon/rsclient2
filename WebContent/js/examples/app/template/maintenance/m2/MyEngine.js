Rs.engine({
    
    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    //libraries : ['ext-3.3.1-debug'],
    
    apps : [{folder : 'm2_1',
            name : '�������е�ά��ҳ��',
            autoRun : true,
            clearCache : true,
            region : {
                rid : 'center',
                x : 10,
                y : 450,
                width : 500,
                height : 400
            }}]
});