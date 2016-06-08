Rs.define('rs.om.OrderBatchFreezeQueryPanel', {

    extend: Rs.ext.query.QueryPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
    	Ext.QuickTips.init();  //������ʾ
        //����������Զ��
        this.headTypeTelescope = new Rs.ext.form.SuggestTag({
            singleSelect: false,
            progCode: 'orderType',
            valueField: 'HEAD_TYPE',
            displayField: 'HEAD_TYPE_NAME' ,
            emptyText: '��ѡ��..'
        });

        //��������Զ��  
        this.orderNoTelescope = new Rs.ext.form.SuggestTag({
            singleSelect: true,
            progCode: 'selOrderNo',
            valueField: 'ORDER_NO',
            displayField: 'ORDER_NO',
            emptyText: '��ѡ��..'
        });

        //�ͻ���Զ��
        this.customerCodeTelescope = new Rs.ext.form.Telescope({
        	dataCompany: '02',
            singleSelect: true,
            progCode: 'customerCode',
            valueField: 'CUSTOMER_CODE',
            displayField: 'CUSTOMER_NAME',
            emptyText: '��ѡ��..'
        });

        //����Ա��Զ�� 
        this.salesCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: false,
            progCode: 'signerCode',
            valueField: 'SALES_CODE',
            displayField: 'PERSON_NAME',
            emptyText: '��ѡ��..'
        });

        //��֯��Զ�� 
        this.orgCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: true,
            progCode: 'selOrg',
            valueField: 'ORG_CODE',
            displayField: 'ORG_NAME',
            emptyText: '��ѡ��..'
        });

        //���´���Զ��
        this.offCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: true,
            progCode: 'selOff',
            valueField: 'OFF_CODE',
            displayField: 'OFF_NAME',
            emptyText: '��ѡ��..'
        });

        //С����Զ��
        this.grpCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: false,
            progCode: 'selGrp',
            valueField: 'GRP_CODE',
            displayField: 'GRP_NAME',
            emptyText: '��ѡ��..' ,
            gridConfig: {
                columns: [{
                    header: 'С�����',
                    dataIndex: 'GRP_CODE',
                    width: 80
                },
                {
                    header: '��������',
                    dataIndex: 'ORG_CODE',
                    width: 120
                },{
                    header: 'С������',
                    dataIndex: 'GRP_NAME',
                    width: 100
                }]
            }
        });

        //����״̬������
        this.orderStateComboBox = new Ext.form.ComboBox({
            id: "STATUS",
            name: "STATUS",
            labelStyle: 'width:100',
            width: 127,
            editable: false,
            fieldLabel: '����״̬',
            emptyText: '��ѡ��..',
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['key', 'value'],
                data: [['', '��ѡ��..'], ['N', 'N-����'], ['S', 'S-���']]
            }),
            valueField: 'key',
            displayField: 'value'
        });

        //���״̬������
        this.auditFlagComboBox = new Ext.form.ComboBox({
            id: "AUDIT_FLAG",
            name: "AUDIT_FLAG",
            labelStyle: 'width:100',
            width: 127,
            editable: false,
            fieldLabel: '���״̬',
            emptyText: '��ѡ��..',
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['key', 'value'],
                data: [['', '��ѡ��..'], ['N', 'N-δ���'], ['B', 'B-����ͨ��'], ['P', 'P-ȫ��ͨ��'], ['R', 'R-����']]
            }),
            valueField: 'key',
            displayField: 'value'
        });

        //����״̬������
        this.freezeFlagComboBox = new Ext.form.ComboBox({
            id: "FREEZE_FLAG",
            name: "FREEZE_FLAG",
            labelStyle: 'width:100',
            width: 127,
            editable: false,
            fieldLabel: '����״̬',
            emptyText: '��ѡ��..',
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['key', 'value'],
                data: [['', '��ѡ��..'], ['N', 'N-δ����'], ['Y', 'Y-����']]
            }),
            valueField: 'key',
            displayField: 'value'
        });

        //��ʼ¼������ ���ڿؼ�
        this.recordDateStartDateField = new Rs.ext.form.DateField({
            fieldLabel: '��ʼ¼������',
            emptyText: '��ѡ��..',
            id: "recordDateStart",
            name: "recordDateStart",
            width: 127,
            maxLength: 10,
            format: "Y/m/d",
            altFormats: 'Y/m/d|Ymd|Y-m-d'
        });

        //��ֹ¼������ ���ڿؼ�
        this.recordDateEndDateField = new Rs.ext.form.DateField({
            fieldLabel: '��ֹ¼������',
            emptyText: '��ѡ��..',
            id: "recordDateEnd",
            name: "recordDateEnd",
            width: 127,
            maxLength: 10,
            format: "Y/m/d" ,
            altFormats:"Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD"
        });

        //��ʼǩ������ ���ڿؼ�
        this.signDateStartDateField = new Rs.ext.form.DateField({
            fieldLabel: '��ʼǩ������',
            emptyText: '��ѡ��..',
            id: "singDateStart",
            name: "singDateStart",
            width: 127,
            maxLength: 10,
            format: "Y/m/d"
        });

        //��ֹǩ������ ���ڿؼ�
        this.signDateEndDateField = new Rs.ext.form.DateField({
            fieldLabel: '��ֹǩ������',
            emptyText: '��ѡ��..',
            id: "singDateEnd",
            name: "singDateEnd",
            width: 127,
            maxLength: 10,
            format: "Y/m/d"
        });

        //��������
        this.headType = {
            dataIndex : 'head_type',
            header : '��������(��ѡ)',
            hidden : false,
            editor: this.headTypeTelescope
        };
        
        //������
        this.orderNo = {
            dataIndex: 'order_no',
            header: '�����ţ���ѡ��',
            hidden: false,
            editor: this.orderNoTelescope
        };
        //�ͻ�
        this.customerCode = {
            dataIndex: 'customer_code',
            header: '�ͻ�',
            hidden: false,
            editor: this.customerCodeTelescope
        };
        //����Ա
        this.salesCode = {
            dataIndex: 'sales_code',
            header: '����Ա',
            hidden: false,
            editor: this.salesCodeTelescope
        };

        //��֯
        this.orgCode = {
            dataIndex: 'org_code',
            header: '��֯',
            hidden: false,
            editor: this.orgCodeTelescope
        };
        //���´�
        this.offCode = {
            dataIndex: 'off_code',
            header: '���´�',
            hidden: false,
            editor: this.offCodeTelescope
        };

        //С��
        this.grpCode = {
            dataIndex: 'grp_code',
            header: 'С��',
            hidden: false,
            editor: this.grpCodeTelescope
        };
        //����״̬
        this.orderState = {
            dataIndex: 'status',
            header: '����״̬',
            hidden: false,
            editor: this.orderStateComboBox
        };

        //��ʼ¼������
        this.recordDateStart = {
            dataIndex: 'record_date_start',
            header: '��ʼ¼������',
            hidden: false,
            editor: this.recordDateStartDateField
        };
        //��ֹ¼������
        this.recordDateEnd = {
            dataIndex: 'record_date_end',
            header: '��ֹ¼������',
            hidden: false,
            editor: this.recordDateEndDateField
        };

        //��ʼǩ������
        this.signDateStart = {
            dataIndex: 'sign_date_start',
            header: '��ʼǩ������',
            hidden: false,
            editor: this.signDateStartDateField
        };
        //��ֹǩ������
        this.signDateEnd = {
            dataIndex: 'sign_date_end',
            header: '��ֹǩ������',
            hidden: false,
            editor: this.signDateEndDateField
        };

        //���״̬
        this.auditFlag = {
            dataIndex: 'audit_flag',
            header: '���״̬',
            hidden: false,
            editor: this.auditFlagComboBox
        };
        //����״̬
        this.freezeFlag = {
            dataIndex: 'freeze_flag',
            header: '����״̬',
            hidden: false,
            editor: this.freezeFlagComboBox
        };

        var conditions = [this.headType, this.orderNo, this.customerCode, this.salesCode, this.orgCode,
                this.offCode, this.grpCode, this.orderState, this.recordDateStart, this.recordDateEnd,
                this.signDateStart, this.signDateEnd, this.auditFlag, this.freezeFlag];

        var plugin = new Rs.ext.state.StatePlugin({
            scheme: 10
        });

        var bbarTool = new Ext.Toolbar({
            items: ["->", plugin.button]
        }) ;
        
        var cfg = {
            conditions : conditions,
            bbar: bbarTool,
            stateId: 'om6f00_templete',
            plugins: plugin
        } ;
        
        config = Rs.apply(config || {},cfg);
        
        this.recordDateStartDateField.on('change',function(df,newValue, oldValue){
            this.recordDateEndDateField.setMinValue(newValue); 
        },this);
        
        this.recordDateEndDateField.on('change',function(df,newValue, oldValue){
            this.recordDateStartDateField.setMaxValue(newValue); 
        },this);
        
        this.signDateStartDateField.on('change',function(df,newValue, oldValue){
            this.signDateEndDateField.setMinValue(newValue); 
        },this);
        
        this.signDateEndDateField.on('change',function(df,newValue, oldValue){
            this.signDateStartDateField.setMaxValue(newValue); 
        },this);
        
        rs.om.OrderBatchFreezeQueryPanel.superclass.constructor.apply(this, arguments);
    }
});