Rs.define('rs.edm.BomDefineMainPanel' , {

    extend :  Ext.Panel,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
	    
		this.tree = new rs.edm.BomDefineTree({
		      region : 'west' ,
		      split : true,
              collapseMode : "mini",
              animCollapse : false,
		      width : 200 
		}) ;
		
		this.grid = new rs.edm.BomDefineGridPanel({
            region : 'center' ,
			treepanel : this.tree //�������������� 
        }) ;
		
		config = Rs.apply(config || {} , {
			title : '�����嵥������' ,
			layout : 'border' ,
			items : [
                this.tree , 
                this.grid 
			]
		}) ;
        rs.edm.BomDefineMainPanel.superclass.constructor.apply(this , arguments) ;
		this.grid.getStore().on('load' ,this.grid.newAddLine , this.grid);
	}
}) ;