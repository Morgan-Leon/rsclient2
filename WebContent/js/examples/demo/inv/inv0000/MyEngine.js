Rs.engine({

    shell: 'border',

    onBeforeInitialize: function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },

    environment: {
        type: 'development',
        config: {
            //clearCache : false ,
            monitor: false
        }
    },

    libraries: ['ext-3.3.1-debug'],

    apps: [{
        folder: '../materialdefine',
        name: "物料定义",
        autoRun: true,
        region: {
            rid: 'center'
        }
    }]
});