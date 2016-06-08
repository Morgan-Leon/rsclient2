R = (function() {
    return {
        id : 'all_in_one_app',
        name : '总账科目定义',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                apps : [/* {
                    folder : '../../windowApp/acctTree',
                    id : 'all_in_one_acct_tree',
                    region : {
                        rid : 'west',
                        width : 200,
                        collapsible : true
                    }
                }, {
                    folder : '../../windowApp/acctGrid',
                    id : 'all_in_one_acct_grid',
                    region : 'center'
                }, {
                    folder : '../../windowApp/acctCreate',
                    id : 'all_in_one_acct_create_panel',
                    region : {
                        rid : 'east',
                        width : 220,
                        collapsible : true
                    }
                }*/
                {
                    folder : 'm1/dimTree',
                    id : 'dimtree',
                    clearCache : true,
                    region : {
                        rid : 'west',
                        width : 200,
                        collapsible : true
                    }}, {
                    folder : 'm1/infoArea',
                    clearCache : true,
                    id : 'infoarea',
                    region : 'center'},
                 {
                    folder : 'm1/dimAdd',
                    id : 'dimadd',
                    clearCache : true,
                    region : {
                        rid : 'east',
                        width : 220,
                        collapsible : true
                    }}]
            }
        }
    };
})();