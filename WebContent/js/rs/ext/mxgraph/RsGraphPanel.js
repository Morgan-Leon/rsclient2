Ext.ns("Rs.ext.mxgraph");

(function(){
	
	Rs.ext.mxgraph.RsGraphPanel = function(config){
		config = Ext.applyIf(config || {}, {
			graph : new Rs.ext.mxgraph.RsGraph({}),
			autoScroll : true
		});
		Rs.ext.mxgraph.RsGraphPanel.superclass.constructor.call(this, config);
	};
	
	Ext.extend(Rs.ext.mxgraph.RsGraphPanel, Ext.Panel, {
		
		/**
		 * 数据XML文件的URL
		 * 
		 * @cfg {String} xmlfile
		 */
		initComponent : function() {
			Rs.ext.mxgraph.RsGraphPanel.superclass.initComponent.call(this);
			this.innerCt = this.add(this.initInnerCt());
		},
		
		//Override
		onRender : function(ct, position){
			Rs.ext.mxgraph.RsGraphPanel.superclass.onRender.apply(this, arguments);
			this.innerCt.on("render", function(p) {
				this.graph.render(p.body.dom);
			}, this, {
				delay : 10,
				scope : this
			});
	    },
	    
	    //private
	    initInnerCt : function(){
	    	return new Ext.Panel({
				border : false,
				layout : 'fit'
			}); 
	    }, 
	    
	    getGraph : function(){
	    	return this.graph;
	    },
	    
	    //private
		destroy : function(){
			Rs.ext.mxgraph.RsGraphPanel.superclass.destroy.apply(this, arguments);
			if(this.graph){
				this.graph.destroy();
			}
		}
	});

	Ext.ComponentMgr.registerType("rs-ext-rsgraphpanel", Rs.ext.mxgraph.RsGraphPanel);
})();
