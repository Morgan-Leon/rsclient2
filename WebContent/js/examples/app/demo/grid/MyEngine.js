Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine({
    
    shell : 'window',
    
    environment : 'development',
    
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'grid',
        name : "��ͨ���",
        autoRun : true,
        region : {
            x:10,
            y:100,
            width : 350,
            height : 200
        }
    }, {
        folder : 'editorGrid',
        name : "�ɱ༭���",
        autoRun : true,
        region : {
            x : 10,
            y : 350,
            width : 350,
            height : 200
        }
    },{
        folder : 'pagingGrid',
        name : "��ҳ���",
        autoRun : true,
        region : {
            x : 360,
            y : 100,
            width : 500,
            height : 200
        }
    }, {
        //�ñ���нű���
        folder : 'expanderGrid',
        autoRun : true,
        region : {
            x : 360,
            y : 350,
            width : 500,
            height : 200
        }
    }, {
        folder : 'treeGrid',
        name : "�����",
        autoRun : true,
        region : {
            x : 860,
            y : 100,
            width : 350,
            height : 200
        }
    }, {
        folder : 'queryGrid',
        name : "��ѯ���",
        autoRun : true,
        region : {
            x : 860,
            y : 350,
            width : 350,
            height : 200
        }
    }, {
        folder : 'bufferGrid',
        name : '���л�����',
        autoRun : false,
        region : {
            x : 10,
            y : 100,
            width : 1210,
            height : 450
        }
    }]
});