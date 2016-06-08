Rs.engine({
    
    shell : 'border',

    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'dimTree',
        name:"维度树",
        region : {
            rid : 'west',
            collapsible : true,
            collapsed : false,
            width : 300
        }
    }, {
        folder : 'infoArea',
        region : 'center'
    }, {
        folder : 'dimAdd',
        name : "手动添加维成员",
        region : {
            x : 500,
            y : 300,
            hidden : true,
            modal : false,
            width : 300,
            height : 230
        }
    }, {
        folder : 'dimSearch',
        name : "根据属性查询维成员",
        region : {
            x : 500,
            y : 300,
            hidden : true,
            modal : false,
            width : 300,
            height : 230
        }
    }]
});