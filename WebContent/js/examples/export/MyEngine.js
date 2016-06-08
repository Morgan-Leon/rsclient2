Rs.engine({
    
    shell : 'window',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    environment : {type:'development', 
    				config : {
    					monitor : false
    				}},
    libraries : ['ext-3.3.1-debug'],
    
    apps : [
	    	{folder : 'gridpagesummary',
		        name:"单页合计导出(显示列在里面)",
		        autoRun:true,
		        region : {
		        	x : 0 ,
		        	y : 0 ,
		        	width : 750 ,
		        	height : 400 
		        }
		     },
		     {folder : 'PacpmOrder',
		        name:"望远镜导出",
		        autoRun:true,
		        region : {
		        	x : 750,
		        	y : 0 ,
		        	width : 500 ,
		        	height : 380 
		        }
		     },
		     {folder : 'gridsummary',
		        name:"单页合计导出(显示列在外面)",
		        autoRun:true,
		        region : {
		        	x : 0 ,
		        	y : 450 ,
		        	width : 750 ,
		        	height : 400 
		        }
		     },
		     {folder : 'onlyexport',
		        name:"仅仅测试导出",
		        autoRun:true,
		        region : {
		        	x : 750 ,
		        	y : 450 ,
		        	width : 500 ,
		        	height : 400 
		        }
		     },
		     {folder : 'hybridgridsummary',
		        name:"总合计导出",
		        autoRun:true,
		        region : {
		        	x : 400 ,
		        	y : 200 ,
		        	width : 500 ,
		        	height : 400 
		        }
		     }
	     ]
});