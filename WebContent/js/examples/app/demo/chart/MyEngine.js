Rs.engine({
    
    shell : 'window',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    libraries : ['ext-3.3.1'],
    
    apps : [{
        folder : 'lineChart',
        name : 'ÕÛÏßÍ¼',
        autoRun : true,
        region : {
            x : 10,
            y : 100,
            width : 500,
            height : 300
        }
    }, {
        folder : 'pieChart',
        name:"±ýÍ¼",
        autoRun:true,
        region : {
            x : 510,
            y : 100,
            width : 500,
            height : 300
        }
    }, {
        folder : 'columnChart',
        name : 'Öù×´Í¼',
        autoRun : true,
        region : {
            x : 10,
            y : 450,
            width : 600,
            height : 300
        }
    }]
});