R = (function() {
    return {
        id : 'withaddpanel',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                apps : [{
                    folder : 'm4/m4_2',
                    id : 'withaddpanel',
                    region : 'center',
                    clearCache : true
                }, {
                    folder : 'm4/m4_1',
                    id : 'buildinaddpanel',
                    clearCache : true,
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