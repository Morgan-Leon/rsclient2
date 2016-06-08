Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine({
    
    shell : 'window',
    
    environment : 'development',
    
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'grid',
        name : "普通表格",
        autoRun : true,
        region : {
            x:10,
            y:100,
            width : 350,
            height : 200
        }
    }, {
        folder : 'editorGrid',
        name : "可编辑表格",
        autoRun : true,
        region : {
            x : 10,
            y : 350,
            width : 350,
            height : 200
        }
    },{
        folder : 'pagingGrid',
        name : "分页表格",
        autoRun : true,
        region : {
            x : 360,
            y : 100,
            width : 500,
            height : 200
        }
    }, {
        //该表格有脚本错
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
        name : "树表格",
        autoRun : true,
        region : {
            x : 860,
            y : 100,
            width : 350,
            height : 200
        }
    }, {
        folder : 'queryGrid',
        name : "查询表格",
        autoRun : true,
        region : {
            x : 860,
            y : 350,
            width : 350,
            height : 200
        }
    }, {
        folder : 'bufferGrid',
        name : '多列缓存表格',
        autoRun : false,
        region : {
            x : 10,
            y : 100,
            width : 1210,
            height : 450
        }
    }]
});