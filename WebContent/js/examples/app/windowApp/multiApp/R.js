R = (function() {

    return {
        
        id : 'multi_app',
        
        name : '×éºÏ³ÌÐò',
        
        js : ['Backend.js'],
        
        objCfg : {
            
            clazz : 'Rs.app.LittleEngine',
            
            cfg : {

                shell : 'border',
                
                stateful : true,

                stateId : 'app_windowApp_multi_app',

                stateEvents : ['appresize' ],
                
                apps : [ {
                    folder : 'acctTree',
                    id : 'multi_app_acct_tree',
                    region : {
                        rid : 'west',
                        width : 200,
                        collapsible : true
                    }
                }, {
                    folder : 'acctGrid',
                    id : 'multi_app_acct_grid',
                    region : 'center'
                }]
            }
        }
    };
})();