Rs.define('rs.inv.MaterialDefineQuery',{
	
	extend : Rs.ext.query.QueryPanel ,
	
	mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		this.grid = config.grid ;
		//查询面板条件
		var conditions  = [{
			dataIndex : 'query_item_code' ,
			header : '物料编码' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_item_name' ,
			header : '物料名称' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_drawing_no' ,
			header : '图号' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_memory_code' ,
			header : '助记码' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_item_abv' ,
			header : '物料简称' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_item_model' ,
			header : '型号' ,
			editor : new Ext.form.TextField({})
		},{
			dataIndex : 'query_special_class' ,
			header : '专用分类' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //使用本地数据
				emptyText : '请选择' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'M-物料' , value : 'M'},                        
						{name : 'P-备件' , value : 'P'},                        
						{name : 'T-工具' , value : 'T'},                        
						{name : 'F-费用' , value : 'F'},                        
						{name : 'S-服务' , value : 'S'},                        
						{name : 'K-包装物' , value : 'K'},                        
						{name : 'A-辅助产品' , value : 'A'},                        
						{name : 'G-其他' , value : 'G'}                        
					]
				})                    
			})
		},{
			dataIndex : 'query_lot_policy' ,
			header : '批量方法' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //使用本地数据
				emptyText : '请选择' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'DIR-直接批量' , value : 'DIR'},                        
						{name : 'MIN-最小批量' , value : 'MIN'},                        
						{name : 'MAX-最大批量' , value : 'MAX'},                        
						{name : 'FIX-固定批量' , value : 'FIX'},                        
						{name : 'PE1-周期批量1' , value : 'PE1'},                        
						{name : 'PE2-周期批量2' , value : 'PE2'}                      
					]
				})                    
			})
		},{
			dataIndex : 'query_pseudo_flag' ,
			header : '配置项目' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //使用本地数据
				emptyText : '请选择' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'S-实件' , value : 'S'},                        
						{name : 'D-直接配置' , value : 'D'},                        
						{name : 'R-关联配置' , value : 'R'}                        
					]
				})                    
			})
		},{
			dataIndex : 'query_mrp_flag' ,
			header : '计划方法' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //使用本地数据
				emptyText : '请选择' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : 'F-装配' , value : 'F'},                        
						{name : 'M-MRP' , value : 'M'},                        
						{name : 'J-JIT' , value : 'J'},                        
						{name : 'O-订货点' , value : 'O'},                        
						{name : 'S-FAP' , value : 'S'}                        
					]
				})                    
			})
		},{
			dataIndex : 'query_routing_flag' ,
			header : '排工序计划' ,
			editor : new Ext.form.ComboBox({
				triggerAction: 'all',
				displayField: 'name' ,
				valueField: 'value' ,
				mode : 'local' , //使用本地数据
				emptyText : '请选择' ,
				store : new Ext.data.JsonStore({
					fields : ['name' , 'value'] ,
					data : [
						{name : '是' , value : 'Y'},                        
						{name : '否' , value : 'S'}                        
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
                    text : '删除',
                    iconCls : 'rs-action-remove',
                    handler : function(){
                       this.grid.doDeleteRecord() ;
                    },
                    scope : this
                },
				{
					text : '新增',
					iconCls : 'rs-action-create',
					handler : function(){
					   this.grid.openDetailPanel(this.grid) ;
					},
					scope : this
				},new Rs.ext.grid.ExportButton({
                        grid : config.grid,
                        filename : "文件",
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