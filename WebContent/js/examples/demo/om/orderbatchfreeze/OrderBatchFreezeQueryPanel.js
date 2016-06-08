Rs.define('rs.om.OrderBatchFreezeQueryPanel', {

    extend: Rs.ext.query.QueryPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
    	Ext.QuickTips.init();  //开启提示
        //订单类型望远镜
        this.headTypeTelescope = new Rs.ext.form.SuggestTag({
            singleSelect: false,
            progCode: 'orderType',
            valueField: 'HEAD_TYPE',
            displayField: 'HEAD_TYPE_NAME' ,
            emptyText: '请选择..'
        });

        //订单号望远镜  
        this.orderNoTelescope = new Rs.ext.form.SuggestTag({
            singleSelect: true,
            progCode: 'selOrderNo',
            valueField: 'ORDER_NO',
            displayField: 'ORDER_NO',
            emptyText: '请选择..'
        });

        //客户望远镜
        this.customerCodeTelescope = new Rs.ext.form.Telescope({
        	dataCompany: '02',
            singleSelect: true,
            progCode: 'customerCode',
            valueField: 'CUSTOMER_CODE',
            displayField: 'CUSTOMER_NAME',
            emptyText: '请选择..'
        });

        //销售员望远镜 
        this.salesCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: false,
            progCode: 'signerCode',
            valueField: 'SALES_CODE',
            displayField: 'PERSON_NAME',
            emptyText: '请选择..'
        });

        //组织望远镜 
        this.orgCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: true,
            progCode: 'selOrg',
            valueField: 'ORG_CODE',
            displayField: 'ORG_NAME',
            emptyText: '请选择..'
        });

        //办事处望远镜
        this.offCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: true,
            progCode: 'selOff',
            valueField: 'OFF_CODE',
            displayField: 'OFF_NAME',
            emptyText: '请选择..'
        });

        //小组望远镜
        this.grpCodeTelescope = new Rs.ext.form.Telescope({
            singleSelect: false,
            progCode: 'selGrp',
            valueField: 'GRP_CODE',
            displayField: 'GRP_NAME',
            emptyText: '请选择..' ,
            gridConfig: {
                columns: [{
                    header: '小组编码',
                    dataIndex: 'GRP_CODE',
                    width: 80
                },
                {
                    header: '所属部门',
                    dataIndex: 'ORG_CODE',
                    width: 120
                },{
                    header: '小组名称',
                    dataIndex: 'GRP_NAME',
                    width: 100
                }]
            }
        });

        //订单状态下拉框
        this.orderStateComboBox = new Ext.form.ComboBox({
            id: "STATUS",
            name: "STATUS",
            labelStyle: 'width:100',
            width: 127,
            editable: false,
            fieldLabel: '订单状态',
            emptyText: '请选择..',
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['key', 'value'],
                data: [['', '请选择..'], ['N', 'N-新增'], ['S', 'S-提货']]
            }),
            valueField: 'key',
            displayField: 'value'
        });

        //审核状态下拉框
        this.auditFlagComboBox = new Ext.form.ComboBox({
            id: "AUDIT_FLAG",
            name: "AUDIT_FLAG",
            labelStyle: 'width:100',
            width: 127,
            editable: false,
            fieldLabel: '审核状态',
            emptyText: '请选择..',
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['key', 'value'],
                data: [['', '请选择..'], ['N', 'N-未审核'], ['B', 'B-部分通过'], ['P', 'P-全部通过'], ['R', 'R-驳回']]
            }),
            valueField: 'key',
            displayField: 'value'
        });

        //冻结状态下拉框
        this.freezeFlagComboBox = new Ext.form.ComboBox({
            id: "FREEZE_FLAG",
            name: "FREEZE_FLAG",
            labelStyle: 'width:100',
            width: 127,
            editable: false,
            fieldLabel: '冻结状态',
            emptyText: '请选择..',
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['key', 'value'],
                data: [['', '请选择..'], ['N', 'N-未冻结'], ['Y', 'Y-冻结']]
            }),
            valueField: 'key',
            displayField: 'value'
        });

        //起始录入日期 日期控件
        this.recordDateStartDateField = new Rs.ext.form.DateField({
            fieldLabel: '起始录入日期',
            emptyText: '请选择..',
            id: "recordDateStart",
            name: "recordDateStart",
            width: 127,
            maxLength: 10,
            format: "Y/m/d",
            altFormats: 'Y/m/d|Ymd|Y-m-d'
        });

        //终止录入日期 日期控件
        this.recordDateEndDateField = new Rs.ext.form.DateField({
            fieldLabel: '终止录入日期',
            emptyText: '请选择..',
            id: "recordDateEnd",
            name: "recordDateEnd",
            width: 127,
            maxLength: 10,
            format: "Y/m/d" ,
            altFormats:"Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD"
        });

        //起始签订日期 日期控件
        this.signDateStartDateField = new Rs.ext.form.DateField({
            fieldLabel: '起始签订日期',
            emptyText: '请选择..',
            id: "singDateStart",
            name: "singDateStart",
            width: 127,
            maxLength: 10,
            format: "Y/m/d"
        });

        //终止签订日期 日期控件
        this.signDateEndDateField = new Rs.ext.form.DateField({
            fieldLabel: '终止签订日期',
            emptyText: '请选择..',
            id: "singDateEnd",
            name: "singDateEnd",
            width: 127,
            maxLength: 10,
            format: "Y/m/d"
        });

        //订单类型
        this.headType = {
            dataIndex : 'head_type',
            header : '订单类型(多选)',
            hidden : false,
            editor: this.headTypeTelescope
        };
        
        //订单号
        this.orderNo = {
            dataIndex: 'order_no',
            header: '订单号（单选）',
            hidden: false,
            editor: this.orderNoTelescope
        };
        //客户
        this.customerCode = {
            dataIndex: 'customer_code',
            header: '客户',
            hidden: false,
            editor: this.customerCodeTelescope
        };
        //销售员
        this.salesCode = {
            dataIndex: 'sales_code',
            header: '销售员',
            hidden: false,
            editor: this.salesCodeTelescope
        };

        //组织
        this.orgCode = {
            dataIndex: 'org_code',
            header: '组织',
            hidden: false,
            editor: this.orgCodeTelescope
        };
        //办事处
        this.offCode = {
            dataIndex: 'off_code',
            header: '办事处',
            hidden: false,
            editor: this.offCodeTelescope
        };

        //小组
        this.grpCode = {
            dataIndex: 'grp_code',
            header: '小组',
            hidden: false,
            editor: this.grpCodeTelescope
        };
        //订单状态
        this.orderState = {
            dataIndex: 'status',
            header: '订单状态',
            hidden: false,
            editor: this.orderStateComboBox
        };

        //起始录入日期
        this.recordDateStart = {
            dataIndex: 'record_date_start',
            header: '起始录入日期',
            hidden: false,
            editor: this.recordDateStartDateField
        };
        //终止录入日期
        this.recordDateEnd = {
            dataIndex: 'record_date_end',
            header: '终止录入日期',
            hidden: false,
            editor: this.recordDateEndDateField
        };

        //起始签订日期
        this.signDateStart = {
            dataIndex: 'sign_date_start',
            header: '起始签订日期',
            hidden: false,
            editor: this.signDateStartDateField
        };
        //终止签订日期
        this.signDateEnd = {
            dataIndex: 'sign_date_end',
            header: '终止签订日期',
            hidden: false,
            editor: this.signDateEndDateField
        };

        //审核状态
        this.auditFlag = {
            dataIndex: 'audit_flag',
            header: '审核状态',
            hidden: false,
            editor: this.auditFlagComboBox
        };
        //冻结状态
        this.freezeFlag = {
            dataIndex: 'freeze_flag',
            header: '冻结状态',
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