R = (function() {
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
                    clearCache : true,
                    region : {
                        rid : 'north',
                        height : 120,
                        collapsible : true
                    }
                },{
                    folder : 'gridPanel',
                    id : 'gridpanel',
                    clearCache : true,
                    region : {
                        rid : 'center'
                    }
                }]
            }
        }
    }
})();