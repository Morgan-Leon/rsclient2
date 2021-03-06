Rs.define('rs.inv.WarehouseDefinitionQuery', {

    extend: Rs.ext.query.QueryPanel,

    constructor: function(config) {
    	
    	
    	Rs.apply(this , config);
    	
		Ext.QuickTips.init();
        
        var conditions = [{
            dataIndex: 'WAREHOUSE_CODE',
            header: '仓库编码',
            editor: new Ext.form.TextField({
            	maxLength : 4
            })
        },
        {
            dataIndex: 'WAREHOUSE_NAME',
            header: '仓库名称',
            hidden: false,
            editor: new Ext.form.TextField({
            	maxLength : 20
            })
        },
        {
            dataIndex: 'MANAGEMENT_FLAG',
            header: '管理方式',
            hidden: false,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                editable : false ,
                mode: 'local',
                //使用本地数据
                emptyText: '请选择',
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [{
                        name: '按仓库管理',
                        value: 'W'
                    },
                    {
                        name: '按货区管理',
                        value: 'B'
                    },
                    {
                        name: '按货位管理',
                        value: 'L'
                    }]
                })
            })
        }, {
            dataIndex: 'TOTAL_QTY_FLAG',
            header: '计划使用仓库',
            hidden: false,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',
                editable : false ,
                emptyText: '请选择',
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [{
                        name: '是',
                        value: 'Y'
                    },
                    {
                        name: '否',
                        value: 'N'
                    }]
                })

            })
        }];

        var plugin = new Rs.ext.state.StatePlugin({ //保存查询方案插件
            scheme: 10   //显示10条记录
        });

        config = Rs.apply(config || {},
        {	
            conditions: conditions,
            collapseMode : 'mini',
            split:true ,
            bbar: new Ext.Toolbar({
                items: ["->", plugin.button]
            }),
            stateful : true ,
            stateId: 'inv1100_query',  //保存查询方案的唯一编码
            plugins: plugin   //将保存方案的插件加入配置项
        });

        rs.inv.WarehouseDefinitionQuery.superclass.constructor.apply(this,arguments) ;
        
		plugin.on('staterestore' , function(plugin , state){
			this.doQuery() ;
		}, this);
		
		plugin.on('stateload' , function(plugin , state){
			var sc = Rs.ext.state.StateManager.getDefaultSchemeCode(this.stateId);
			if(!sc){
				this.doQuery() ;
			}
		}, this);
    }
});