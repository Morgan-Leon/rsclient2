Rs.apply(Rs, {
	
    /**
     * 系统主题
     */
    Themes : (function(){
        
        return {
            
            'blue' : ['resources/css/xtheme-blue.css'],
            
            'gray' : ['resources/css/xtheme-gray.css'],
            
            'access' : ['resources/css/xtheme-access.css'],
            
            'black' : ['resources/css/xtheme-black.css'],
            
            'blue03' : ['resources/css/xtheme-blue03.css'],
            
            'brown' : ['resources/css/xtheme-brown.css'],
            
            'brown02' : ['resources/css/xtheme-brown02.css'],
            
            'green' : ['resources/css/xtheme-green.css'],
            
            'pink' : ['resources/css/xtheme-pink.css'],
            
            'purple' : ['resources/css/xtheme-purple.css'],
            
            'red03' : ['resources/css/xtheme-red03.css']
                       
        };
        
    })(),
    
	/**
	 * 引入第三方类库 
	 */
	Libraries : (function() {

		return {
			
		    'ext-3.3.1' : {
                js : ['lib/ext-3.3.1/adapter/ext/ext-base.js', 
                      'lib/ext-3.3.1/ext-all.js',
                      'lib/ext-3.3.1/override.js',
                      'ext/rs-ext-mini.js',
                      'lib/ext-3.3.1/src/locale/ext-lang-zh_CN.js'
                      ],
                css : ['lib/ext-3.3.1/resources/css/ext-all-notheme.css',
                       'ext/resources/css/rs-ext-mini.css'],
                getTheme : function(theme){
		            return 'lib/ext-3.3.1/resources/css/xtheme-' + theme + '.css';
                }
            },
            
            'ext-3.3.1-debug' : {
                js : ['lib/ext-3.3.1/adapter/ext/ext-base-debug.js', 
                      'lib/ext-3.3.1/ext-all-debug.js',
                      'lib/ext-3.3.1/override.js',
                      'ext/rs-ext-debug.js',
                      'lib/ext-3.3.1/src/locale/ext-lang-zh_CN.js'],
                css : ['lib/ext-3.3.1/resources/css/ext-all-notheme.css',
                       'ext/resources/css/rs-ext-all.css'],
                getTheme : function(theme){
                    return 'lib/ext-3.3.1/resources/css/xtheme-' + theme + '.css';
                }
            },
            
            'jquery-1.5' : {
                js : ['lib/jquery/jquery-1.5.min.js'],
                getTheme : function(){return;}
            },
            
            'jquery-1.5-debug' : {
                js : ['lib/jquery/jquery-1.5.js'],
                getTheme : function(){return;}                      
            },
            
            'fusionchart-xt-enterprise' : {
                js : ['lib/FusionWidgets_XT_Enterprise/Charts/FusionCharts.js',
                      'lib/FusionWidgets_XT_Enterprise/Charts/jquery.min.js',
                      'lib/FusionWidgets_XT_Enterprise/Charts/FusionCharts.jqueryplugin.js',
                      'lib/FusionWidgets_XT_Enterprise/Charts/FusionChartsExportComponent.js',
                      'lib/FusionWidgets_XT_Enterprise/Charts/FusionCharts.HC.js',
                      'lib/FusionWidgets_XT_Enterprise/Charts/FusionCharts.HC.gantt.js',
                      'lib/FusionWidgets_XT_Enterprise/Charts/FusionCharts.HC.Widgets.js'],
                getTheme : function(){return;}
            }

		};

	})()
});
