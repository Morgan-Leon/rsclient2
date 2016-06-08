R = (function() {
    return {
        id : 'all_in_one_app',
        name : '×éºÏ³ÌÐò',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                apps : [ {
                    folder : 'acctTree',
                    id : 'all_in_one_acct_tree',
                    region : {
                        rid : 'west',
                        width : 200,
                        collapsible : true
                    }
                }, {
                    folder : 'acctGrid',
                    id : 'all_in_one_acct_grid',
                    region : 'center'
                }, {
                    folder : 'acctCreate',
                    id : 'all_in_one_acct_create_panel',
                    region : {
                        rid : 'east',
                        width : 220,
                        collapsible : true
                    }
                }]
            }
        }
    };
})();