Rs.define('rs.inv.MaterialProductionPlan', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
        var materialData = [{
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [
                  
                this.itemCode = new Ext.form.TextField({
                    name: 'item_code',
                    readOnly: true,
                    fieldLabel: '*物料编码'
                }),
                
                this.mpFlag = new Ext.form.ComboBox({
                    name: 'mp_flag',
                    fieldLabel: '制造采购件',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'M-自制',
                    width: 125,
                    value: 'M',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: '自制',
                            value: 'M'
                        },
                        {
                            name: '外购',
                            value: 'P'
                        }]
                    })
                }),
                
                this.deptCode = new Rs.ext.form.Telescope({
                    name: 'dept_code',
                    fieldLabel: '责任部门',
                    width: 125,
                    singleSelect: true,
                    progCode: 'deptCode',
                    valueField: 'DEPT_CODE',
                    displayField: 'DEPT_NAME'
                }), this.lotPolicy = new Ext.form.ComboBox({
                    name: 'lot_policy',
                    fieldLabel: '批量方法',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'DIR-直接批量',
                    width: 125,
                    value: 'DIR',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'DIR-直接批量',
                            value: 'DIR'
                        },
                        {
                            name: 'MIN-最小批量',
                            value: 'MIN'
                        },
                        {
                            name: 'MAX-最大批量',
                            value: 'MAX'
                        },
                        {
                            name: 'FIX-固定批量',
                            value: 'FIX'
                        },
                        {
                            name: 'PE1-周期批量1',
                            value: 'PE1'
                        },
                        {
                            name: 'PE2-周期批量2',
                            value: 'PE2'
                        }]
                    })
                }),
                this.orderPoint = new Ext.form.TextField({
                    name: 'order_point',
                    fieldLabel: '订货点',
                    labelAlign: 'right',
                    value: '0.00'
                }),
                this.roundTimes = new Ext.form.TextField({
                    name: 'round_times',
                    fieldLabel: '取整倍数',
                    labelAlign: 'right',
                    value: '1'
                })
                ]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.itemName = new Ext.form.TextField({
                    name: 'item_name',
                    readOnly: true,
                    fieldLabel: '*物料名称'
                }),
                
                this.scrapRate = new Ext.form.TextField({
                    name: 'scrap_rate',
                    fieldLabel: '废品率(%)',
                    labelAlign: 'right',
                    value: '0.00'
                }),
                
                this.mrpFlag = new Ext.form.ComboBox({
                    name: 'mrp_flag',
                    fieldLabel: '计划方法',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'M-MRP',
                    width: 125,
                    value: 'M',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'F-装配',
                            value: 'F'
                        },
                        {
                            name: 'M-MRP',
                            value: 'M'
                        },
                        {
                            name: 'J-JIT',
                            value: 'J'
                        },
                        {
                            name: 'O-订货点',
                            value: 'O'
                        },
                        {
                            name: 'S-FAP',
                            value: 'S'
                        }]
                    })
                }),
                this.lotQty = new Ext.form.TextField({
                    name: 'lot_qty',
                    fieldLabel: '批量数量'
                }),
                this.orderQty = new Ext.form.TextField({
                    name: 'order_qty',
                    fieldLabel: '订货数量',
                    labelAlign: 'right',
                    value: '1.00'
                })]
            }]
        }];

        var fieldset = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: '.25',
                layout: 'form',
                items: [this.productFlag = new Ext.form.Checkbox({
                    name: 'product_flag',
                    inputValue: 'Y',
                    boxLabel: '最终产品'
                })]
            },
            {
                columnWidth: '.25',
                layout: 'form',
                items: [this.phantomFlag = new Ext.form.Checkbox({
                    name: 'phantom_flag',
                    inputValue: 'Y',
                    boxLabel: '虚拟件'
                })]
            },
            {
                columnWidth: '.25',
                layout: 'form',
                items: [this.itemListFlag = new Ext.form.Checkbox({
                    name: 'item_list_flag',
                    inputValue: 'Y',
                    boxLabel: '产品系列'
                })]
            },
            {
                columnWidth: '.25',
                layout: 'form',
                items: [this.mpsFlag = new Ext.form.Checkbox({
                    name: 'mps_flag',
                    inputValue: 'Y',
                    boxLabel: 'MPS项'
                })]
            }]
        };

        var unit = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [this.leadTimeFlag = new Ext.form.ComboBox({
                    name: 'lead_time_flag',
                    fieldLabel: '提前期种类',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'F-固定',
                    value: 'F',
                    width: 125,
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'F-固定',
                            value: 'F'
                        },
                        {
                            name: 'D-动态',
                            value: 'D'
                        },
                        {
                            name: 'A-按计划参数',
                            value: 'A'
                        }]
                    })
                }),
                
                this.leadDays = new Ext.form.TextField({
                    name: 'lead_days',
                    fieldLabel: '动态系数(天)',
                    value: '0'
                }),
                
                this.plannerCode = new Rs.ext.form.Telescope({
                    name: 'planner_code',
                    fieldLabel: '计划员编码',
                    width: 125,
                    singleSelect: true,
                    progCode: 'edmAddress',
                    valueField: 'ACCOUNT_ID',
                    displayField: 'ACCOUNT_NAME'
                }), 
                
                this.lotDays = new Ext.form.TextField({
                    name: 'lot_days',
                    fieldLabel: '推移天数(天)',
                    value: '1'
                }),
                
                this.lot_merge_flag = new Ext.form.ComboBox({
                    name: 'lot_merge_flag',
                    fieldLabel: '合批标记',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'A-按计划参数',
                    width: 125,
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A-按计划参数',
                            value: 'A'
                        },
                        {
                            name: 'Y-合批',
                            value: 'Y'
                        },
                        {
                            name: 'P-计划不合批',
                            value: 'P'
                        },
                        {
                            name: 'N-全程不合批',
                            value: 'N'
                        }]
                    })
                }),
                
                this.lowLevelCode = new Ext.form.TextField({
                    name: 'low_level_code',
                    fieldLabel: '低层码'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [
                this.leadTime = new Ext.form.TextField({
                    name: 'lead_time',
                    fieldLabel: '固定提前期(天)',
                    value: '0'
                }),
                
                this.normBatch = new Ext.form.TextField({
                    name: 'norm_batch',
                    fieldLabel: '提前期批量',
                    value: '0.00'
                }),
                
                this.planConstant = new Ext.form.TextField({
                    name: 'plan_constant',
                    fieldLabel: '计划填补量',
                    value: '0.00'
                }),
                
                this.pseudoFlag = new Ext.form.ComboBox({
                    name: 'pseudo_flag',
                    fieldLabel: '配置项目',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'S-实体',
                    width: 125,
                    value: 'S',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'S-实体',
                            value: 'S'
                        },
                        {
                            name: 'D-直接配置',
                            value: 'D'
                        },
                        {
                            name: 'R-关联配置',
                            value: 'R'
                        }]
                    })
                }),
                
                this.onhandFlag = new Ext.form.ComboBox({
                    name: 'onhand_flag',
                    fieldLabel: '考虑库存',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'A-按计划参数',
                    width: 125,
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A-按计划参数',
                            value: 'A'
                        },
                        {
                            name: 'Y-考虑',
                            value: 'Y'
                        },
                        {
                            name: 'N-不考虑',
                            value: 'N'
                        }]
                    })
                }),
                
                this.fapResource = new Ext.form.ComboBox({
                    name: 'fap_resource',
                    fieldLabel: '装配关系来源',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'A-按计划参数',
                    width: 125,
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A-按计划参数',
                            value: 'A'
                        },
                        {
                            name: 'E-bom',
                            value: 'E'
                        },
                        {
                            name: 'P-工序',
                            value: 'P'
                        }]
                    })
                })]
            }]
        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,
            frame: true,
            autoScroll: true,
            labelAlign: 'right',
            items: [materialData, fieldset, unit]
        });
        rs.inv.MaterialProductionPlan.superclass.constructor.call(this, config);
    }
});