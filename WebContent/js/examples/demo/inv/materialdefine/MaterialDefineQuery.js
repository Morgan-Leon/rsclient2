Rs.define('rs.inv.MaterialDefineQuery',{
	
	extend : Rs.ext.query.QueryPanel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		this.grid = config.grid ;
		//��ѯ�������
		var conditions  = [{
			dataIndex : 'query_item_code' ,
			header : '���ϱ���' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_item_name' ,
			header : '��������' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_drawing_no' ,
			header : 'ͼ��' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_memory_code' ,
			header : '������' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_item_abv' ,
			header : '���ϼ��' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_item_model' ,
			header : '�ͺ�' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_special_class' ,
			header : 'ר�÷���' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //ʹ�ñ�������
				emptyText : '��ѡ��' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'M-����' , value : 'M'},                        
						{name : 'P-����' , value : 'P'},                        
						{name : 'T-����' , value : 'T'},                        
						{name : 'F-����' , value : 'F'},                        
						{name : 'S-����' , value : 'S'},                        
						{name : 'K-��װ��' , value : 'K'},                        
						{name : 'A-������Ʒ' , value : 'A'},                        
						{name : 'G-����' , value : 'G'}                        
					]
				})                    
			})
		},{
			dataIndex : 'query_lot_policy' ,
			header : '��������' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //ʹ�ñ�������
				emptyText : '��ѡ��' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'DIR-ֱ������' , value : 'DIR'},                        
						{name : 'MIN-��С����' , value : 'MIN'},                        
						{name : 'MAX-�������' , value : 'MAX'},                        
						{name : 'FIX-�̶�����' , value : 'FIX'},                        
						{name : 'PE1-��������1' , value : 'PE1'},                        
						{name : 'PE2-��������2' , value : 'PE2'}                      
					]
				})                    
			})
		},{
			dataIndex : 'query_pseudo_flag' ,
			header : '������Ŀ' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //ʹ�ñ�������
				emptyText : '��ѡ��' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'S-ʵ��' , value : 'S'},                        
						{name : 'D-ֱ������' , value : 'D'},                        
						{name : 'R-��������' , value : 'R'}                        
					]
				})                    
			})
		},{
			dataIndex : 'query_mrp_flag' ,
			header : '�ƻ�����' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //ʹ�ñ�������
				emptyText : '��ѡ��' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'F-װ��' , value : 'F'},                        
						{name : 'M-MRP' , value : 'M'},                        
						{name : 'J-JIT' , value : 'J'},                        
						{name : 'O-������' , value : 'O'},                        
						{name : 'S-FAP' , value : 'S'}                        
					]
				})                    
			})
		},{
			dataIndex : 'query_routing_flag' ,
			header : '�Ź���ƻ�' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //ʹ�ñ�������
				emptyText : '��ѡ��' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : '��' , value : 'Y'},                        
						{name : '��' , value : 'S'}                        
					]
				})                    
			})
		}] ;
		
		var plugin = new Rs.ext.state.StatePlugin({
			scheme : 10 
		}) ;
		
		this.config = Rs.apply(config || {} ,{
			conditions : conditions ,
			autoHeight : true ,
			tbar : [{
                    text : 'ɾ��',
                    iconCls : 'rs-action-remove',
                    handler : function(){
                       this.grid.doDeleteRecord() ;
                    },
                    scope : this
                },
				{
					text : '����',
					iconCls : 'rs-action-create',
					handler : function(){
					   this.grid.openDetailPanel(this.grid) ;
					},
					scope : this
				},new Rs.ext.grid.ExportButton({
                        grid : config.grid,
                        filename : "�ļ�",
                        paging : true
                })
			],
    	   bbar : new  Ext.Toolbar({
                items : ["->",plugin.button]    	   
    	   }),
    	   stateId : 'inv_meterialdefine' ,
    	   plugins : plugin 			
		}) ;
        rs.inv.MaterialDefineQuery.superclass.constructor.call(this, config);
	}
}) ;