Rs.engine( {

    shell : {
        type : 'tab'
    },

    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },    
    
    libraries : [ 'ext-3.3.1' ],

    apps : [{
        folder : 'tab1',
        autoRun : true,
        region : 'tab'
    },{
        folder : 'tab2',
        autoRun : true,
        region : 'tab'
    },{
        folder : 'tab3',
        autoRun : true,
        region : 'tab'
    }]

});
