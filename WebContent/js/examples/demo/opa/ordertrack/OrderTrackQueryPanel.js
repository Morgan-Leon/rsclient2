Rs.define('rs.opa.opa4700.OrderTrackQueryPanel', {

    extend: Rs.ext.query.QueryPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
        
    	//Ԥ�ⵥ��
    	this.orderNoCondition = {
            id: 'order_no_001',
            dataIndex: 'order_no',
            header: '*Ԥ�ⶩ����',
            hidden: false,
            allowBlank: false,
            //���ô���������ɾ�����������
            editor: this.aaa = new Rs.ext.form.Telescope({
                progCode: "forecastNo",
                valueField: "ORDER_NO",
                displayField: "ORDER_NO" ,
                singleSelect : true
            })
        } ;
    	
        //�������
        this.workNoCondition ={
            id: 'work_no_001',
            dataIndex: 'work_no',
            header: '*�������',
            hidden: false,
            allowBlank: false,
            //���ô���������ɾ�����������
            editor: new Rs.ext.form.Telescope({
                progCode: "selWorkNo",
                valueField: "WORK_NO",
                displayField: "WORK_NO",
                forceSelection: false ,
                singleSelect : true
            })
        } ; 
        
    	//���ϱ���
        this.itemCodeCondition = {
            id: 'item_code_001',
            dataIndex: 'item_code',
            header: '���ϱ���',
            hidden: false,
            editor: new Rs.ext.form.Telescope({
                progCode: "opaItem",
                valueField: "ITEM_CODE",
                displayField: "ITEM_CODE"
            })
        } ;
        
        //��С��������
        this.minDaysCondition = {
            id: 'minDays_001',
            dataIndex: 'minDays',
            header: '��С��������',
            hidden: false,
            allowBlank: false,
            //���ô���������ɾ�����������
            editor: new Ext.form.NumberField({
                emptyText: '������Ǹ�����..',
                allowDecimals: false,
                allowNegative: false
            })
        } ;
        
        //���ڱ��
        this.delayFlagCondition = {
            id: 'DELAY_FLAG_001',
            dataIndex: 'DELAY_FLAG',
            header: '���ڱ��',
            hidden: false,
            allowBlank: false,
            //���ô���������ɾ�����������
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '��ѡ��..'], ['Y', 'Y-����'], ['N', 'N-������']]
                }),
                valueField: 'key',
                displayField: 'value'
            })
        } ;
        
        //���ű���
        this.deptCodeCondition =  {
            id: 'DEPT_CODE_001',
            dataIndex: 'DEPT_CODE',
            header: '���ű���',
            hidden: false,
            editor: new Rs.ext.form.Telescope({
                progCode: "opaDept",
                valueField: "DEPT_CODE",
                displayField: "DEPT_CODE"
            })
        } ;
        
        //ִ�н׶�
        this.sysFlagCondition = {
            id: 'SYS_FLAG_001',
            dataIndex: 'SYS_FLAG',
            header: 'ִ�н׶�',
            hidden: false,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '��ѡ��..'], ['MRP', 'MRP-�ƻ�'], ['PAC', 'PAC-����'], ['PM', 'PM-�ɹ�']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //��ʼ�ƻ���������
        this.planStartDateBeginCondition = {
            id: 'plan_start_date_begin_001',
            dataIndex: 'plan_start_date_begin',
            header: '��ʼ�ƻ���������',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ֹ�ƻ���������
        this.planStartDateEndCondition = {
            id: 'plan_start_date_end_001',
            dataIndex: 'plan_start_date_end',
            header: '��ֹ�ƻ���������',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ʼ�ƻ��깤����
        this.planEndDateBeginCondition = {
            id: 'plan_end_date_begin_001',
            dataIndex: 'plan_end_date_begin',
            header: '��ʼ�ƻ��깤����',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ֹ�ƻ��깤����
        this.planEndDateEndCondition =  {
            id: 'plan_end_date_end_001',
            dataIndex: 'plan_end_date_end',
            header: '��ֹ�ƻ��깤����',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ʼʵ�ʿ�������
        this.actualStartDateBeginCondition = {
            id: 'actual_start_date_begin_001',
            dataIndex: 'actual_start_date_begin',
            header: '��ʼʵ�ʿ�������',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ֹʵ�ʿ�������
        this.actualStartDateEndCondition = {
            id: 'actual_start_date_end_001',
            dataIndex: 'actual_start_date_end',
            header: '��ֹʵ�ʿ�������',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ʼʵ���깤����
        this.actualEndDateBeginCondition = {
            id: 'actual_end_date_begin_001',
            dataIndex: 'actual_end_date_begin',
            header: '��ʼʵ���깤����',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //��ֹʵ���깤����
        this.actualEndDateEndCondition = {
            id: 'actual_end_date_end_001',
            dataIndex: 'actual_end_date_end',
            header: '��ֹʵ���깤����',
            hidden: true,
            editor: new Ext.form.DateField({
                format: "Y/m/d",
                altFormats: "Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD",
                maxLength: 10
            }),
            wrapper: function(v) {
                return v instanceof Date ? v.format("Y/m/d") : v;
            }
        } ;
        
        //����/�ɹ�
        this.mpFlagCondition = {
            id: 'mp_flag_001',
            dataIndex: 'mp_flag',
            header: '����/�ɹ�',
            hidden: false,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '��ѡ��..'], ['M', 'M-����'], ['P', 'P-�ɹ�']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //�������ٱ��
        this.customerSearchFlagCondition = {
            id: 'customer_search_flag_001',
            dataIndex: 'customer_search_flag',
            header: '�������ٱ��',
            hidden: false,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '��ѡ��..'], ['Y', 'Y-����'], ['N', 'N-������']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //��Э���
        this.coopFlagCondition = {
            id: 'coop_flag_001',
            dataIndex: 'coop_flag',
            header: '��Э���',
            hidden: true,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '��ѡ��..'], ['Y', 'Y-��Э'], ['N', 'N-����Э']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //���ϱ��
        this.coopDbFlagCondition = {
            id: 'coop_db_flag_001',
            dataIndex: 'coop_db_flag',
            header: '���ϱ��',
            hidden: true,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '��ѡ��..'], ['Y', 'Y-����'], ['N', 'N-������']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        var conditions =  [this.orderNoCondition,this.workNoCondition,this.itemCodeCondition,
                this.minDaysCondition ,this.delayFlagCondition , this.deptCodeCondition ,this.sysFlagCondition,
                this.planStartDateBeginCondition , this.planStartDateEndCondition , 
                this.planEndDateBeginCondition , this.planEndDateEndCondition , this.actualStartDateBeginCondition ,
                this.actualStartDateEndCondition , this.actualEndDateBeginCondition , this.actualEndDateEndCondition ,
                this.mpFlagCondition , this.customerSearchFlagCondition ,this.coopFlagCondition , this.coopDbFlagCondition
        ] ;
        
        var plugin = new Rs.ext.state.StatePlugin({
            scheme: 10
        });

        var bbarTool = new Ext.Toolbar({
            items: ["->", plugin.button]
        }) ;
        
        var cfg = {
            conditions : conditions ,
            bbar: bbarTool,
            stateId: 'opa4700_template',
            plugins: plugin
        } ;
        
        config = Rs.apply(config || {},cfg);
        
        rs.opa.opa4700.OrderTrackQueryPanel.superclass.constructor.apply(this, arguments);
    }
});