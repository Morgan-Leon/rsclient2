Rs.define('rs.pm.PacPmOrder',{
	
	extend : Rs.ext.grid.GeneralselPanel ,

	mixins : [Rs.app.Main] ,

	constructor : function(config){
		
		config = Rs.apply(config || {} , {
			progCode : 'invVendor',
			singleSelected :　false ,
			columns : [{
	            dataIndex : 'VENDOR_NAME',
	            header : '供应商名称',
	            width : 200,
	            sortable : true
	        }, {
	            dataIndex : 'VENDOR_CODE',
	            header : '供应商编码',
	            width : 150,
	            sortable : true
	        }],
			tbar : [{
			     text : '<font color=red>这是一个望远镜面板</font>' ,
			     scope : this ,
			     handler : function(){
			         Ext.Msg.alert("提示","这是一个望远镜面板");
			     }
			}] 
		}) ;
		
		rs.pm.PacPmOrder.superclass.constructor.call(this, config);
				
	},
	
	initComponent : function() {
		
		rs.pm.PacPmOrder.superclass.initComponent
				.apply(this, arguments);

				
		this.topToolbar.addButton(new Rs.ext.grid.ExportButton({
					grid : this.grid,
					filename : "文件"
		}));
			
	}
});