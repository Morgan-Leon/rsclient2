R = (function() {
    return {
        id : 'addpanel',
        name : '���յ�ά��',
        objCfg : {
            clazz : 'Rs.app.LittleEngine',
            cfg : {
                shell : 'border',
                environment : {type:'development', config : {monitor : false}},
                apps : [{
                    folder : 'm3_3/m3_3_2',
                    id : 'documenthead',
                    name : '���յ�ͷ��Ϣ',
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