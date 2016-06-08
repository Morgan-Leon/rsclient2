Rs.define('rs.opa.OrderTrackMainPanel' , {

    extend :  Ext.Panel,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
	    
		var grid = new rs.opa.OrderTrackGridPanel({
            region : 'center'		
		}) ;
		var query = new rs.opa.opa4700.OrderTrackQueryPanel({
    		  region : 'north' ,
			  node : grid.store.getRootNode()
		}) ;
		
		config = Rs.apply(config || {} , {
            
			title : '¶©µ¥¸ú×Ù' ,
			
			layout : 'border' ,
            
			items : [
                grid,
                query
			]
			
		}) ;
        rs.opa.OrderTrackMainPanel.superclass.constructor.apply(this , arguments) ;	
	}
}) ;