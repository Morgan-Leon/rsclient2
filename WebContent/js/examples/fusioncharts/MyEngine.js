Rs.engine({
	shell : 'window' ,
	
	onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    environment : {type:'development', 
    				config : {
    					monitor : false
    				}},
    libraries : ['ext-3.3.1-debug'],
	apps : [
		{	folder : 'mscolumn3dlinedy',
	        name:"mscolumn3dlinedy’πœ÷",
	        autoRun:true,
	        region : {
	        	x : 0 ,
	        	y : 0 ,
	        	width : 750 ,
	        	height : 400 
	       }
	     }
	]
});