Rs.define('Rs.Telescopse', {

    extend: Rs.ext.query.QueryPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var conditions = [{
            dataIndex: 'tree_id',
            header: '程序编码',
            hidden: false,
            editor: new Ext.form.TextField({})
        },
        {
            dataIndex: 'group_id',
            header: '采购小组',
            hidden: false,
            editor: this.t = new Rs.ext.form.Telescope({
                progCode: 'pmLot',
                valueField: 'LOT_NO',
                displayField: 'LOT_NO',
				queryPanelConfig : {
					//displayQueryField : ['LOT_NO']
				} ,
				/*gridConfig : {
					columns : [{
	                    header : '批号' ,
	                    dataIndex : 'LOT_NO' ,
	                    width : 200
	                }]
				} ,*/
                singleSelect: false ,
				buildProgCondtion: function(progCondition) {
                    return " mrp_flag='N'" + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                }
                //readOnly : true 
            })
        },{
            dataIndex: 'set_name',
            header: '成套名称',
            hidden: false,
            editor: this.t = new Rs.ext.form.Telescope({
                progCode: 'pmWare',
                valueField: 'WAREHOUSE_NAME',
                displayField: 'WAREHOUSE_NAME',
				//配置查询头的显示字段
                queryPanelConfig : {
                    //displayQueryField : ['LOT_NO']
                } ,
				//配置grid上的列
                gridConfig : {
                    columns : [{
                        header : '仓库编码' ,
                        dataIndex : 'WAREHOUSE_CODE' ,
                        width : 200
                    }]
                } ,
                singleSelect: true
                //readOnly : true 
            })
        } ,{
            dataIndex: 'date',
            header: '日期',
            hidden: false,
            editor: new Rs.ext.form.DateField({})
        }];

        var plugin = new Rs.ext.state.StatePlugin({
            scheme: 10
        });

        config = Rs.apply(config || {},
        {
            conditions: conditions,
            height: 500,
            collapsible: true,
            //True表示为面板是可收缩的，并自动渲染一个展开/收缩的轮换按钮在头部
            bbar: new Ext.Toolbar({
                items: ["->", plugin.button]
            }),
            stateId: 'oa_role_navigate_second_management_o',
            //用户偏好设置保存在数据库中的一个唯一ID
            plugins: plugin
        });
        Rs.Telescopse.superclass.constructor.apply(this, arguments);
    }
});