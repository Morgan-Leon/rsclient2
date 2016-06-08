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
		        name:"��ҳ�ϼƵ���(��ʾ��������)",
		        autoRun:true,
		        region : {
		        	x : 0 ,
		        	y : 0 ,
		        	width : 750 ,
		        	height : 400 
		        }
		     },
		     {folder : 'PacpmOrder',
		        name:"��Զ������",
		        autoRun:true,
		        region : {
		        	x : 750,
		        	y : 0 ,
		        	width : 500 ,
		        	height : 380 
		        }
		     },
		     {folder : 'gridsummary',
		        name:"��ҳ�ϼƵ���(��ʾ��������)",
		        autoRun:true,
		        region : {
		        	x : 0 ,
		        	y : 450 ,
		        	width : 750 ,
		        	height : 400 
		        }
		     },
		     {folder : 'onlyexport',
		        name:"�������Ե���",
		        autoRun:true,
		        region : {
		        	x : 750 ,
		        	y : 450 ,
		        	width : 500 ,
		        	height : 400 
		        }
		     },
		     {folder : 'hybridgridsummary',
		        name:"�ܺϼƵ���",
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