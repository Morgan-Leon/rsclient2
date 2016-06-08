Rs.define('rs.inv.WarehouseDefinitionQuery', {

    extend: Rs.ext.query.QueryPanel,

    constructor: function(config) {
    	
    	
    	Rs.apply(this , config);
    	
		Ext.QuickTips.init();
        
        var conditions = [{
            dataIndex: 'WAREHOUSE_CODE',
            header: '�ֿ����',
            editor: new Ext.form.TextField({
            	maxLength : 4
            })
        },
        {
            dataIndex: 'WAREHOUSE_NAME',
            header: '�ֿ�����',
            hidden: false,
            editor: new Ext.form.TextField({
            	maxLength : 20
            })
        },
        {
            dataIndex: 'MANAGEMENT_FLAG',
            header: '����ʽ',
            hidden: false,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                editable : false ,
                mode: 'local',
                //ʹ�ñ�������
                emptyText: '��ѡ��',
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [{
                        name: '���ֿ����',
                        value: 'W'
                    },
                    {
                        name: '����������',
                        value: 'B'
                    },
                    {
                        name: '����λ����',
                        value: 'L'
                    }]
                })
            })
        }, {
            dataIndex: 'TOTAL_QTY_FLAG',
            header: '�ƻ�ʹ�òֿ�',
            hidden: false,
            editor: new Ext.form.ComboBox({
                triggerAction: 'all',
                displayField: 'name',
                valueField: 'value',
                mode: 'local',
                editable : false ,
                emptyText: '��ѡ��',
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [{
                        name: '��',
                        value: 'Y'
                    },
                    {
                        name: '��',
                        value: 'N'
                    }]
                })

            })
        }];

        var plugin = new Rs.ext.state.StatePlugin({ //�����ѯ�������
            scheme: 10   //��ʾ10����¼
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
            stateId: 'inv1100_query',  //�����ѯ������Ψһ����
            plugins: plugin   //�����淽���Ĳ������������
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
    
	//����ڲ�ѯǰ��Ҫ����SP,��������д��
    /*doQuery : function(){
        var params = this.getParams();
        Rs.Service.call({
        	url: '/demo/inv/warehouse/WarehouseDefinitionGridDataService.rsc', 
            method : 'callSp',
            params :{
                params : params,             //���ò������̶�д���������޸�
                myPara : 'this is my value'  //���ò������Զ��崫����������Ը�����Ҫ���ӡ�ɾ�����޸Ĵ˲������ֺͲ���ֵ
            }
        },
        //����Ϊ�̶�д���������޸�
        function(result){
            if(result.success == true){
                //�������SP�ɹ�����ִ�����ݿ��ѯ
                this.grid.getStore().reload({params : params});
            }else {
                //�������SPʧ�ܣ��������ʾ��Ϣ
                Ext.Msg.alert('��ʾ', result.msg);
            }
        }, 
        this);
    } , */
});