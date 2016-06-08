Rs.define('rs.inv.WarehouseDefinitionQuery', {

    extend : Rs.ext.query.QueryPanel,

    mixins : [Rs.app.Main],

    constructor : function(config) {
    	var conditions = [{
                dataIndex : 'warehouse_code',
                header : '仓库编码',
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'warehouse_name',
                header : '仓库名称',
                hidden : false,
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'management_flag',
                header : '管理方式',
                hidden : false,
                editor : new Ext.form.ComboBox({
                    triggerAction: 'all',
                    displayField: 'name' ,
                    valueField: 'value' ,
                	mode : 'local' , //使用本地数据
                    emptyText : '请选择' ,
                    store : new Ext.data.JsonStore({
                        fields : ['name' , 'value'] ,
                        data : [
                            {name : '按仓库管理' , value : 'W'},                        
                            {name : '按货区管理' , value : 'B'},                        
                            {name : '按货位管理' , value : 'L'}                        
                        ]
                    })
                })
            },{
                dataIndex : 'total_qty_flag',
                header : '计划使用仓库',
                hidden : false,
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
                            {name : '否' , value : 'N'}                        
                        ]
                    })                    
                
                })
            }] ;
    	
    	var plugin = new Rs.ext.state.StatePlugin({
    	   scheme : 10 
    	}) ;
    	
    	config = Rs.apply(config || {} ,{
            conditions : conditions ,
            autoHeight : true ,
            //isPop : true ,  //是否为弹出式, 默认为false
            //collapsible : true , //True表示为面板是可收缩的，并自动渲染一个展开/收缩的轮换按钮在头部
            tbar : [
                {
                    text : '删除',
                    iconCls : 'rs-action-remove',
                    scope : this ,
                    handler : function(){
                        this.fireEvent('delete',this);                       
                    }
                },{
                    text : '保存',
                    iconCls : 'rs-action-save',
                    scope : this,
                    handler : function(){
                        this.fireEvent("save",this) ;                    
                    }
                },{
                    text : '返回',
                    iconCls : 'rs-action-cancel',
                    scope : this,
                    handler : this.deleteRecord
                },
                	new Rs.ext.grid.ExportButton({
                		grid : config.grid,
						filename : "文件",
						paging : true
                	})
                ,'->'/*,
                {
                    text : '帮助',
                iconCls : 'rs-action-help'
                }*/
            ],
    	   bbar : new  Ext.Toolbar({
                items : ["->",plugin.button]    	   
    	   }),
    	   stateId : 'inv_warehouse_code' ,
    	   plugins : plugin 
    	}) ;

        rs.inv.WarehouseDefinitionQuery.superclass.constructor.call(this, config);
        this.addEvents('delete','save');
        Rs.EventBus.register(this, 'warehouseQuery', ['delete']);        
        Rs.EventBus.register(this, 'warehouseQuery', ['save']);   
        
        Rs.EventBus.register(this, 'popquerypanel', ['query']);
            
    }
});