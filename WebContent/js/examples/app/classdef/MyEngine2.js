Rs.engine( {

    shell : 'window',

    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },

    libraries : [ 'ext-3.3.1' ],
    
    apps : [ {
        folder : 'app1',
        autoRun : true,
        region : {
            x : 200,
            y : 150,
            width : 300,
            height : 200
        }
    }, {
        folder : 'app2',
        autoRun : true,
        region : {
            x : 550,
            y : 150,
            width : 300,
            height : 200
        }
    } ]

});
