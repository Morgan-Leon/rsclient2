Rs.define('rs.inv.WarehouseDefinitionQuery', {

    extend : Rs.ext.query.QueryPanel,

    mixins : [Rs.app.Main],

    constructor : function(config) {
    	var conditions = [{
                dataIndex : 'warehouse_code',
                header : '�ֿ����',
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'warehouse_name',
                header : '�ֿ�����',
                hidden : false,
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'management_flag',
                header : '����ʽ',
                hidden : false,
                editor : new Ext.form.ComboBox({
                    triggerAction: 'all',
                    displayField: 'name' ,
                    valueField: 'value' ,
                	mode : 'local' , //ʹ�ñ�������
                    emptyText : '��ѡ��' ,
                    store : new Ext.data.JsonStore({
                        fields : ['name' , 'value'] ,
                        data : [
                            {name : '���ֿ����' , value : 'W'},                        
                            {name : '����������' , value : 'B'},                        
                            {name : '����λ����' , value : 'L'}                        
                        ]
                    })
                })
            },{
                dataIndex : 'total_qty_flag',
                header : '�ƻ�ʹ�òֿ�',
                hidden : false,
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
                            {name : '��' , value : 'N'}                        
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
            //isPop : true ,  //�Ƿ�Ϊ����ʽ, Ĭ��Ϊfalse
            //collapsible : true , //True��ʾΪ����ǿ������ģ����Զ���Ⱦһ��չ��/�������ֻ���ť��ͷ��
            tbar : [
                {
                    text : 'ɾ��',
                    iconCls : 'rs-action-remove',
                    scope : this ,
                    handler : function(){
                        this.fireEvent('delete',this);                       
                    }
                },{
                    text : '����',
                    iconCls : 'rs-action-save',
                    scope : this,
                    handler : function(){
                        this.fireEvent("save",this) ;                    
                    }
                },{
                    text : '����',
                    iconCls : 'rs-action-cancel',
                    scope : this,
                    handler : this.deleteRecord
                },
                	new Rs.ext.grid.ExportButton({
                		grid : config.grid,
						filename : "�ļ�",
						paging : true
                	})
                ,'->'/*,
                {
                    text : '����',
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