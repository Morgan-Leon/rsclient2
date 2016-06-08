Rs.define('rs.om.OrderBatchFreezeMainPanel' , {
    
	extend : Ext.Panel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config) {
	   
		var gridPanel = new rs.om.OrderBatchFreezeGridPanel({
            region : 'center'
		}) ;
		
		var queryPanel = new rs.om.OrderBatchFreezeQueryPanel({
            region : 'north' ,
            collapsed : false,
            grid : gridPanel ,
            autoHeight : true
		}) ;
		
		var detailPanel = new rs.om.OrderBatchFreezeDetailPanel({
            region : 'south' ,
            height : 250 ,
            collapsed : true ,
            collapsible : true
		}) ;
		
		config = Rs.apply(config || {} , {
            layout : 'border' ,		
            title : '¶©µ¥Åú½â¶³' ,
            items : [
                queryPanel ,
                gridPanel ,
                detailPanel
            ]
		}) ;
	   
		rs.om.OrderBatchFreezeMainPanel.superclass.constructor.apply(this , arguments) ;
	}
});