/*R = (function() {
    return {
        id : 'northquerypanel',
        name : '����������ά��ҳ��',
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