Rs.BASE_PATH = '/rsc/js/rs';
Rs.engine( {

    shell : 'window',
    
    theme : 'blue',
    
    environment : 'development',
    
    libraries : [ 'ext-3.3.1' ],

    apps : [ {
        folder : 'tree',
        name : "ÆÕÍ¨Ê÷",
        autoRun : true,
        region : {
            x : 10,
            y : 100,
            width : 250,
            height : 400
        }
    }, {
        folder : 'tree',
        id : 'query_tree',
        name : '²éÑ¯Ê÷',
        autoRun : true,
        objCfg : {
            clazz : 'rs.demo.tree.Tree',
            cfg : {
                queryEnable : true
            }  
        },
        region : {
            x : 260,
            y : 100,
            width : 250,
            height : 400
        }
    }, {
        folder : 'pagingTree',
        name : "·ÖÒ³Ê÷",
        autoRun : true,
        region : {
            x : 510,
            y : 100,
            width : 250,
            height : 400
        }
    }, {
        folder : 'pagingTree',
        id : 'query_paging_tree',
        name : "²éÑ¯·ÖÒ³Ê÷",
        autoRun : true,
        objCfg : {
            clazz : 'rs.demo.tree.PagingTree',
            cfg : {
                queryEnable : true
            }
        },
        region : {
            x : 760,
            y : 100,
            width : 250,
            height : 400
        }
    }, {
        folder : 'acctTree',
        autoRun : true,
        region : {
            x : 1010,
            y : 100,
            width : 250,
            height : 400
        }
    }]
});