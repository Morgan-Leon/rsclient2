R = (function() {
    return {
        id : 'all_in_one_app',
        name : '带新增面板的维护页面',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                apps : [{
                    folder : 'm5/m5_2',
                    id : 'gridwithaddlinepanel',
                    clearCache : true,
                    region : {
                        rid : 'center'
                    }
                }, {
                    folder : 'm5/m5_1',
                    id : 'addlinepanel',
                    clearCache : true,
                    region : {
                        rid : 'south',
                        height : 220,
                        collapsible : true
                    }
                }]
            }
        }
    };
})();