Rs.engine({
    
    shell : 'window',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'm1',
        name : 'ά��Ա����',
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
        name:"������ʽ��������ά��ҳ��",
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
        name : '�������е�ά��ҳ��',
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
        name : '����������ά��ҳ��',
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
        name : '������������ά��ҳ��',
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