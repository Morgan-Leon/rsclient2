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
                    fieldLabel: '*���ϱ���'
                }),
                
                this.mpFlag = new Ext.form.ComboBox({
                    name: 'mp_flag',
                    fieldLabel: '����ɹ���',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'M-����',
                    width: 125,
                    value: 'M',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: '����',
                            value: 'M'
                        },
                        {
                            name: '�⹺',
                            value: 'P'
                        }]
                    })
                }),
                
                this.deptCode = new Rs.ext.form.Telescope({
                    name: 'dept_code',
                    fieldLabel: '���β���',
                    width: 125,
                    singleSelect: true,
                    progCode: 'deptCode',
                    valueField: 'DEPT_CODE',
                    displayField: 'DEPT_NAME'
                }), this.lotPolicy = new Ext.form.ComboBox({
                    name: 'lot_policy',
                    fieldLabel: '��������',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'DIR-ֱ������',
                    width: 125,
                    value: 'DIR',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'DIR-ֱ������',
                            value: 'DIR'
                        },
                        {
                            name: 'MIN-��С����',
                            value: 'MIN'
                        },
                        {
                            name: 'MAX-�������',
                            value: 'MAX'
                        },
                        {
                            name: 'FIX-�̶�����',
                            value: 'FIX'
                        },
                        {
                            name: 'PE1-��������1',
                            value: 'PE1'
                        },
                        {
                            name: 'PE2-��������2',
                            value: 'PE2'
                        }]
                    })
                }),
                this.orderPoint = new Ext.form.TextField({
                    name: 'order_point',
                    fieldLabel: '������',
                    labelAlign: 'right',
                    value: '0.00'
                }),
                this.roundTimes = new Ext.form.TextField({
                    name: 'round_times',
                    fieldLabel: 'ȡ������',
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
                    fieldLabel: '*��������'
                }),
                
                this.scrapRate = new Ext.form.TextField({
                    name: 'scrap_rate',
                    fieldLabel: '��Ʒ��(%)',
                    labelAlign: 'right',
                    value: '0.00'
                }),
                
                this.mrpFlag = new Ext.form.ComboBox({
                    name: 'mrp_flag',
                    fieldLabel: '�ƻ�����',
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
                            name: 'F-װ��',
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
                            name: 'O-������',
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
                    fieldLabel: '��������'
                }),
                this.orderQty = new Ext.form.TextField({
                    name: 'order_qty',
                    fieldLabel: '��������',
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
                    boxLabel: '���ղ�Ʒ'
                })]
            },
            {
                columnWidth: '.25',
                layout: 'form',
                items: [this.phantomFlag = new Ext.form.Checkbox({
                    name: 'phantom_flag',
                    inputValue: 'Y',
                    boxLabel: '�����'
                })]
            },
            {
                columnWidth: '.25',
                layout: 'form',
                items: [this.itemListFlag = new Ext.form.Checkbox({
                    name: 'item_list_flag',
                    inputValue: 'Y',
                    boxLabel: '��Ʒϵ��'
                })]
            },
            {
                columnWidth: '.25',
                layout: 'form',
                items: [this.mpsFlag = new Ext.form.Checkbox({
                    name: 'mps_flag',
                    inputValue: 'Y',
                    boxLabel: 'MPS��'
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
                    fieldLabel: '��ǰ������',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'F-�̶�',
                    value: 'F',
                    width: 125,
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'F-�̶�',
                            value: 'F'
                        },
                        {
                            name: 'D-��̬',
                            value: 'D'
                        },
                        {
                            name: 'A-���ƻ�����',
                            value: 'A'
                        }]
                    })
                }),
                
                this.leadDays = new Ext.form.TextField({
                    name: 'lead_days',
                    fieldLabel: '��̬ϵ��(��)',
                    value: '0'
                }),
                
                this.plannerCode = new Rs.ext.form.Telescope({
                    name: 'planner_code',
                    fieldLabel: '�ƻ�Ա����',
                    width: 125,
                    singleSelect: true,
                    progCode: 'edmAddress',
                    valueField: 'ACCOUNT_ID',
                    displayField: 'ACCOUNT_NAME'
                }), 
                
                this.lotDays = new Ext.form.TextField({
                    name: 'lot_days',
                    fieldLabel: '��������(��)',
                    value: '1'
                }),
                
                this.lot_merge_flag = new Ext.form.ComboBox({
                    name: 'lot_merge_flag',
                    fieldLabel: '�������',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'A-���ƻ�����',
                    width: 125,
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A-���ƻ�����',
                            value: 'A'
                        },
                        {
                            name: 'Y-����',
                            value: 'Y'
                        },
                        {
                            name: 'P-�ƻ�������',
                            value: 'P'
                        },
                        {
                            name: 'N-ȫ�̲�����',
                            value: 'N'
                        }]
                    })
                }),
                
                this.lowLevelCode = new Ext.form.TextField({
                    name: 'low_level_code',
                    fieldLabel: '�Ͳ���'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [
                this.leadTime = new Ext.form.TextField({
                    name: 'lead_time',
                    fieldLabel: '�̶���ǰ��(��)',
                    value: '0'
                }),
                
                this.normBatch = new Ext.form.TextField({
                    name: 'norm_batch',
                    fieldLabel: '��ǰ������',
                    value: '0.00'
                }),
                
                this.planConstant = new Ext.form.TextField({
                    name: 'plan_constant',
                    fieldLabel: '�ƻ����',
                    value: '0.00'
                }),
                
                this.pseudoFlag = new Ext.form.ComboBox({
                    name: 'pseudo_flag',
                    fieldLabel: '������Ŀ',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'S-ʵ��',
                    width: 125,
                    value: 'S',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'S-ʵ��',
                            value: 'S'
                        },
                        {
                            name: 'D-ֱ������',
                            value: 'D'
                        },
                        {
                            name: 'R-��������',
                            value: 'R'
                        }]
                    })
                }),
                
                this.onhandFlag = new Ext.form.ComboBox({
                    name: 'onhand_flag',
                    fieldLabel: '���ǿ��',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'A-���ƻ�����',
                    width: 125,
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A-���ƻ�����',
                            value: 'A'
                        },
                        {
                            name: 'Y-����',
                            value: 'Y'
                        },
                        {
                            name: 'N-������',
                            value: 'N'
                        }]
                    })
                }),
                
                this.fapResource = new Ext.form.ComboBox({
                    name: 'fap_resource',
                    fieldLabel: 'װ���ϵ��Դ',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'name',
                    triggerAction: 'all',
                    emptyText: 'A-���ƻ�����',
                    width: 125,
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A-���ƻ�����',
                            value: 'A'
                        },
                        {
                            name: 'E-bom',
                            value: 'E'
                        },
                        {
                            name: 'P-����',
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