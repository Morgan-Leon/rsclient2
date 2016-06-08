R = (function() {
    return {
        id : 'addpanel',
        name : '接收单维护',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                environment : {type:'development', config : {monitor : false}},
                apps : [{
                    folder : 'm3_3/m3_3_2',
                    id : 'documenthead',
                    name : '接收单头信息',
                    region : {
                        rid : 'north',
                        height : 200,
                        collapsible : true
                    }
                },{
                    folder : 'm3_3/m3_3_1',
                    id : 'detailgrid',
                    region : {
                        rid : 'center'
                    }
                }]
            }
        }
    };
})();