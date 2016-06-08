Rs.define('Rs.Telescopse', {

    extend: Rs.ext.query.QueryPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {

        var conditions = [{
            dataIndex: 'tree_id',
            header: '�������',
            hidden: false,
            editor: new Ext.form.TextField({})
        },
        {
            dataIndex: 'group_id',
            header: '�ɹ�С��',
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
	                    header : '����' ,
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
            header: '��������',
            hidden: false,
            editor: this.t = new Rs.ext.form.Telescope({
                progCode: 'pmWare',
                valueField: 'WAREHOUSE_NAME',
                displayField: 'WAREHOUSE_NAME',
				//���ò�ѯͷ����ʾ�ֶ�
                queryPanelConfig : {
                    //displayQueryField : ['LOT_NO']
                } ,
				//����grid�ϵ���
                gridConfig : {
                    columns : [{
                        header : '�ֿ����' ,
                        dataIndex : 'WAREHOUSE_CODE' ,
                        width : 200
                    }]
                } ,
                singleSelect: true
                //readOnly : true 
            })
        } ,{
            dataIndex: 'date',
            header: '����',
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
            //True��ʾΪ����ǿ������ģ����Զ���Ⱦһ��չ��/�������ֻ���ť��ͷ��
            bbar: new Ext.Toolbar({
                items: ["->", plugin.button]
            }),
            stateId: 'oa_role_navigate_second_management_o',
            //�û�ƫ�����ñ��������ݿ��е�һ��ΨһID
            plugins: plugin
        });
        Rs.Telescopse.superclass.constructor.apply(this, arguments);
    }
});