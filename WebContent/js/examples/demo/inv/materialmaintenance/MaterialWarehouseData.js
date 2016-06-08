Rs.define('rs.inv.MaterialWarehouseData', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
        var message1 = [{
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [this.itemCode = new Ext.form.TextField({
                    readOnly: true,
                    name: 'item_code',
                    fieldLabel: '*���ϱ���'
                }),
                
                this.warehouseCode = new Rs.ext.form.Telescope({
                    name: 'warehouse_code',
                    fieldLabel: 'Ĭ�ϲֿ�',
                    singleSelect: true,
                    width: 120,
                    progCode: 'warehouse',
                    valueField: 'WAREHOUSE_CODE',
                    displayField: 'WAREHOUSE_NAME'
                }), this.locationCode = new Rs.ext.form.Telescope({
                    name: 'location_code',
                    fieldLabel: 'Ĭ�ϻ�λ',
                    singleSelect: true,
                    width: 120,
                    progCode: 'wLocation',
                    valueField: 'LOCATION_CODE',
                    displayField: 'LOCATION_DESC'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.itemName = new Ext.form.TextField({
                    name: 'item_name',
                    readOnly: true,
                    fieldLabel: '*��������'
                }),
                this.binCode = new Rs.ext.form.Telescope({
                    name: 'bin_code',
                    fieldLabel: 'Ĭ�ϻ���',
                    singleSelect: true,
                    width: 120,
                    progCode: 'wBin',
                    valueField: 'BIN_CODE',
                    displayField: 'BIN_DESC'
                }), this.lotFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    fieldLabel: '���α��',
                    name: 'lot_flag'
                })]
            }]
        }];

        var unit = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [this.safetyStock = new Ext.form.TextField({
                    name: 'safety_stock',
                    fieldLabel: '��ȫ����'
                }),
                this.stockDays = new Ext.form.TextField({
                    name: 'stock_days',
                    fieldLabel: '��������'
                }),
                this.tolerance = new Ext.form.TextField({
                    name: 'tolerance',
                    fieldLabel: '�ֿ��ʲ�'
                }),
                this.cycleCount = new Ext.form.TextField({
                    name: 'cycle_count',
                    fieldLabel: '�̵�����'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.maxStock = new Ext.form.TextField({
                    name: 'max_stock',
                    fieldLabel: '��ߴ���'
                }),
                this.minStock = new Ext.form.TextField({
                    name: 'min_stock',
                    fieldLabel: '��ʹ���'
                }),
                this.uniqueFlag = new Ext.form.Checkbox({
                    name: 'unique_flag',
                    inputValue: 'Y',
                    fieldLabel: '����������'
                }),
                
                this.abcClass = new Ext.form.ComboBox({
                    name: 'abc_class',
                    fieldLabel: 'ABC��',
                    mode: 'local',
                    width: 120,
                    displayField: 'name',
                    valueField: 'value',
                    triggerAction: 'all',
                    emptyText: 'A',
                    value: 'A',
                    store: new Ext.data.JsonStore({
                        fields: ['name', 'value'],
                        data: [{
                            name: 'A',
                            value: 'A'
                        },
                        {
                            name: 'B',
                            value: 'B'
                        },
                        {
                            name: 'C',
                            value: 'C'
                        }]
                    })
                })]
            }]
        };

        var classification = {
            layout: 'column',
            xtype: 'fieldset',
            autoHeight: true,
            items: [{
                columnWidth: .5,
                layout: 'form',
                items: [this.onHandQty = new Ext.form.TextField({
                    name: 'on_hand_qty',
                    labelAlign: 'right',
                    fieldLabel: '���п����'
                }),
                this.allocationQty = new Ext.form.TextField({
                    name: 'allocation_qty',
                    fieldLabel: '����ռ����'
                }),
                this.scrapQty = new Ext.form.TextField({
                    name: 'scrap_qty',
                    fieldLabel: '���Ϸ�Ʒ��'
                }),
                this.jitUnstockQty = new Ext.form.TextField({
                    name: 'jit_unstock_qty',
                    fieldLabel: '����δ�����'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.onHandAmt = new Ext.form.TextField({
                    name: 'on_hand_amt',
                    fieldLabel: '���п����'
                }),
                this.inspectionQty = new Ext.form.TextField({
                    name: 'inspection_qty',
                    fieldLabel: '���ϴ�����'
                }),
                this.normPrice = new Ext.form.TextField({
                    name: 'norm_price',
                    fieldLabel: '��׼����'
                })]
            }]
        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,
            //���Ϊtrue����������form.reset()�������õ����һ�μ��ص����ݻ�setValues()���ݣ��������һ��ʼ��������ʱ������
            frame: true,
            labelAlign: 'right',
            autoScroll: true,
            items: [message1, unit, classification]
        });
        rs.inv.MaterialWarehouseData.superclass.constructor.call(this, config);
    }
});