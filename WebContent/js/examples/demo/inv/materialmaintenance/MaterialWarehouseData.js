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
                    fieldLabel: '*物料编码'
                }),
                
                this.warehouseCode = new Rs.ext.form.Telescope({
                    name: 'warehouse_code',
                    fieldLabel: '默认仓库',
                    singleSelect: true,
                    width: 120,
                    progCode: 'warehouse',
                    valueField: 'WAREHOUSE_CODE',
                    displayField: 'WAREHOUSE_NAME'
                }), this.locationCode = new Rs.ext.form.Telescope({
                    name: 'location_code',
                    fieldLabel: '默认货位',
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
                    fieldLabel: '*物料名称'
                }),
                this.binCode = new Rs.ext.form.Telescope({
                    name: 'bin_code',
                    fieldLabel: '默认货区',
                    singleSelect: true,
                    width: 120,
                    progCode: 'wBin',
                    valueField: 'BIN_CODE',
                    displayField: 'BIN_DESC'
                }), this.lotFlag = new Ext.form.Checkbox({
                    inputValue: 'Y',
                    fieldLabel: '批次标记',
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
                    fieldLabel: '安全储备'
                }),
                this.stockDays = new Ext.form.TextField({
                    name: 'stock_days',
                    fieldLabel: '储备天数'
                }),
                this.tolerance = new Ext.form.TextField({
                    name: 'tolerance',
                    fieldLabel: '仓库允差'
                }),
                this.cycleCount = new Ext.form.TextField({
                    name: 'cycle_count',
                    fieldLabel: '盘点周期'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.maxStock = new Ext.form.TextField({
                    name: 'max_stock',
                    fieldLabel: '最高储备'
                }),
                this.minStock = new Ext.form.TextField({
                    name: 'min_stock',
                    fieldLabel: '最低储备'
                }),
                this.uniqueFlag = new Ext.form.Checkbox({
                    name: 'unique_flag',
                    inputValue: 'Y',
                    fieldLabel: '单件管理标记'
                }),
                
                this.abcClass = new Ext.form.ComboBox({
                    name: 'abc_class',
                    fieldLabel: 'ABC码',
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
                    fieldLabel: '现有库存量'
                }),
                this.allocationQty = new Ext.form.TextField({
                    name: 'allocation_qty',
                    fieldLabel: '物料占用量'
                }),
                this.scrapQty = new Ext.form.TextField({
                    name: 'scrap_qty',
                    fieldLabel: '物料废品量'
                }),
                this.jitUnstockQty = new Ext.form.TextField({
                    name: 'jit_unstock_qty',
                    fieldLabel: '下线未入库量'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [this.onHandAmt = new Ext.form.TextField({
                    name: 'on_hand_amt',
                    fieldLabel: '现有库存金额'
                }),
                this.inspectionQty = new Ext.form.TextField({
                    name: 'inspection_qty',
                    fieldLabel: '物料待验量'
                }),
                this.normPrice = new Ext.form.TextField({
                    name: 'norm_price',
                    fieldLabel: '标准单价'
                })]
            }]
        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,
            //如果为true，则表单对象的form.reset()方法重置到最后一次加载的数据或setValues()数据，以相对于一开始创建表单那时的数据
            frame: true,
            labelAlign: 'right',
            autoScroll: true,
            items: [message1, unit, classification]
        });
        rs.inv.MaterialWarehouseData.superclass.constructor.call(this, config);
    }
});