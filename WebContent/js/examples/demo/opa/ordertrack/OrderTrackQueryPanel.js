Rs.define('rs.opa.opa4700.OrderTrackQueryPanel', {

    extend: Rs.ext.query.QueryPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
        
    	//预测单号
    	this.orderNoCondition = {
            id: 'order_no_001',
            dataIndex: 'order_no',
            header: '*预测订单号',
            hidden: false,
            allowBlank: false,
            //设置此条件不能删除，必须存在
            editor: this.aaa = new Rs.ext.form.Telescope({
                progCode: "forecastNo",
                valueField: "ORDER_NO",
                displayField: "ORDER_NO" ,
                singleSelect : true
            })
        } ;
    	
        //工作令号
        this.workNoCondition ={
            id: 'work_no_001',
            dataIndex: 'work_no',
            header: '*工作令号',
            hidden: false,
            allowBlank: false,
            //设置此条件不能删除，必须存在
            editor: new Rs.ext.form.Telescope({
                progCode: "selWorkNo",
                valueField: "WORK_NO",
                displayField: "WORK_NO",
                forceSelection: false ,
                singleSelect : true
            })
        } ; 
        
    	//物料编码
        this.itemCodeCondition = {
            id: 'item_code_001',
            dataIndex: 'item_code',
            header: '物料编码',
            hidden: false,
            editor: new Rs.ext.form.Telescope({
                progCode: "opaItem",
                valueField: "ITEM_CODE",
                displayField: "ITEM_CODE"
            })
        } ;
        
        //最小拖期天数
        this.minDaysCondition = {
            id: 'minDays_001',
            dataIndex: 'minDays',
            header: '最小拖期天数',
            hidden: false,
            allowBlank: false,
            //设置此条件不能删除，必须存在
            editor: new Ext.form.NumberField({
                emptyText: '请输入非负整数..',
                allowDecimals: false,
                allowNegative: false
            })
        } ;
        
        //拖期标记
        this.delayFlagCondition = {
            id: 'DELAY_FLAG_001',
            dataIndex: 'DELAY_FLAG',
            header: '拖期标记',
            hidden: false,
            allowBlank: false,
            //设置此条件不能删除，必须存在
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '请选择..'], ['Y', 'Y-拖期'], ['N', 'N-不拖期']]
                }),
                valueField: 'key',
                displayField: 'value'
            })
        } ;
        
        //部门编码
        this.deptCodeCondition =  {
            id: 'DEPT_CODE_001',
            dataIndex: 'DEPT_CODE',
            header: '部门编码',
            hidden: false,
            editor: new Rs.ext.form.Telescope({
                progCode: "opaDept",
                valueField: "DEPT_CODE",
                displayField: "DEPT_CODE"
            })
        } ;
        
        //执行阶段
        this.sysFlagCondition = {
            id: 'SYS_FLAG_001',
            dataIndex: 'SYS_FLAG',
            header: '执行阶段',
            hidden: false,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '请选择..'], ['MRP', 'MRP-计划'], ['PAC', 'PAC-生产'], ['PM', 'PM-采购']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //起始计划开工日期
        this.planStartDateBeginCondition = {
            id: 'plan_start_date_begin_001',
            dataIndex: 'plan_start_date_begin',
            header: '起始计划开工日期',
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
        
        //终止计划开工日期
        this.planStartDateEndCondition = {
            id: 'plan_start_date_end_001',
            dataIndex: 'plan_start_date_end',
            header: '终止计划开工日期',
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
        
        //起始计划完工日期
        this.planEndDateBeginCondition = {
            id: 'plan_end_date_begin_001',
            dataIndex: 'plan_end_date_begin',
            header: '起始计划完工日期',
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
        
        //终止计划完工日期
        this.planEndDateEndCondition =  {
            id: 'plan_end_date_end_001',
            dataIndex: 'plan_end_date_end',
            header: '终止计划完工日期',
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
        
        //起始实际开工日期
        this.actualStartDateBeginCondition = {
            id: 'actual_start_date_begin_001',
            dataIndex: 'actual_start_date_begin',
            header: '起始实际开工日期',
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
        
        //终止实际开工日期
        this.actualStartDateEndCondition = {
            id: 'actual_start_date_end_001',
            dataIndex: 'actual_start_date_end',
            header: '终止实际开工日期',
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
        
        //起始实际完工日期
        this.actualEndDateBeginCondition = {
            id: 'actual_end_date_begin_001',
            dataIndex: 'actual_end_date_begin',
            header: '起始实际完工日期',
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
        
        //终止实际完工日期
        this.actualEndDateEndCondition = {
            id: 'actual_end_date_end_001',
            dataIndex: 'actual_end_date_end',
            header: '终止实际完工日期',
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
        
        //自制/采购
        this.mpFlagCondition = {
            id: 'mp_flag_001',
            dataIndex: 'mp_flag',
            header: '自制/采购',
            hidden: false,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '请选择..'], ['M', 'M-自制'], ['P', 'P-采购']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //订单跟踪标记
        this.customerSearchFlagCondition = {
            id: 'customer_search_flag_001',
            dataIndex: 'customer_search_flag',
            header: '订单跟踪标记',
            hidden: false,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '请选择..'], ['Y', 'Y-跟踪'], ['N', 'N-不跟踪']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //外协标记
        this.coopFlagCondition = {
            id: 'coop_flag_001',
            dataIndex: 'coop_flag',
            header: '外协标记',
            hidden: true,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '请选择..'], ['Y', 'Y-外协'], ['N', 'N-非外协']]
                }),
                valueField: 'key',
                displayField: 'value',
                value: ''
            })
        } ;
        
        //带料标记
        this.coopDbFlagCondition = {
            id: 'coop_db_flag_001',
            dataIndex: 'coop_db_flag',
            header: '带料标记',
            hidden: true,
            editor: new Ext.form.ComboBox({
                typeAhead: true,
                triggerAction: 'all',
                lazyRender: true,
                mode: 'local',
                store: new Ext.data.ArrayStore({
                    id: 0,
                    fields: ['key', 'value'],
                    data: [['', '请选择..'], ['Y', 'Y-带料'], ['N', 'N-不带料']]
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