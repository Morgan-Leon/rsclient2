R = (function() {
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