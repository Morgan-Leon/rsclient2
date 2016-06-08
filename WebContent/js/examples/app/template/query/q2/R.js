/*R = (function() {
    return {
        id : 'northquerypanel',
        name : '带新增面板的维护页面',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                apps : [{
                    folder : 'queryPanel',
                    id : 'querypanel',
                    clearCache : false,
                    region : {
                        rid : 'north',
                        height : 120,
                        collapsible : true
                    }
                },{
                    folder : 'gridPanel',
                    id : 'gridpanel',
                    region : {
                        rid : 'center'
                    }
                },{
                    folder : '../../windowApp/acctTree',
                    id : 'tree',
                    region : {
                        rid : 'west'
                    }
                }]
            }
        }
    };
})();*/

R = (function() {

    return {
        id : 'generalselpanel',
        js : ['GeneralselPanel.js'],
        objCfg : 'rs.app.query.GeneralselPanel'
    };

})();