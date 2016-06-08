Rs.define('rs.pm.PacPmOrder',{
	
	extend : Rs.ext.grid.GeneralselPanel ,

	mixins : [Rs.app.Main] ,

	constructor : function(config){
		
		config = Rs.apply(config || {} , {
			progCode : 'invVendor',
			singleSelected :��false ,
			columns : [{
	            dataIndex : 'VENDOR_NAME',
	            header : '��Ӧ������',
	            width : 200,
	            sortable : true
	        }, {
	            dataIndex : 'VENDOR_CODE',
	            header : '��Ӧ�̱���',
	            width : 150,
	            sortable : true
	        }],
			tbar : [{
			     text : '<font color=red>����һ����Զ�����</font>' ,
			     scope : this ,
			     handler : function(){
			         Ext.Msg.alert("��ʾ","����һ����Զ�����");
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
					filename : "�ļ�"
		}));
			
	}
});