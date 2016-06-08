Rs.engine({
    
    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    environment : {type:'development', config : {monitor : false}},
    libraries : ['ext-3.3.1-debug'],
    
    apps : [{folder : 'm3_2',
        name:"接收单录入",
        autoRun:true,
        region : {
            rid : 'center'
        }}]
});