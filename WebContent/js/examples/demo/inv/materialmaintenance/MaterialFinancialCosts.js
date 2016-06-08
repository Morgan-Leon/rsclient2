Rs.define('rs.inv.MaterialFinancialCosts', {

    extend: Rs.ext.form.FormPanel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
        var unit = {
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
                    xtype: 'textfield',
                    fieldLabel: '物料编码'
                }),
                
                this.costFlag = new Ext.form.Checkbox({
                    name: 'cost_flag',
                    xtype: 'checkbox',
                    inputValue: 'Y',
                    checked: true,
                    fieldLabel: '成本核算对象'
                }),
                this.planPrice = new Ext.form.TextField({
                    name: 'plan_price',
                    fieldLabel: '计划价格',
                    labelAlign: 'right',
                    value: '0'
                }),
                this.standardCost = new Ext.form.TextField({
                    name: 'standard_cost',
                    fieldLabel: '标准成本'
                }),
                this.netWeight = new Ext.form.TextField({
                    name: 'net_weight',
                    fieldLabel: '单件净重'
                }),
                this.grossWeight = new Ext.form.TextField({
                    name: 'gross_weight',
                    fieldLabel: '单件毛重'
                }),
                
                this.taxCode = new Rs.ext.form.Telescope({
                    name: 'tax_code',
                    fieldLabel: '税码',
                    width: 125,
                    singleSelect: true,
                    progCode: 'taxCode',
                    valueField: 'TAX_CODE',
                    displayField: 'TAX_DESC'
                })]
            },
            {
                columnWidth: .5,
                layout: 'form',
                items: [
                
                this.itemName = new Ext.form.TextField({
                    name: 'item_name',
                    readOnly: true,
                    fieldLabel: '物料名称'
                }),
                this.byProductFlag = new Ext.form.TextField(
                {
                    name: 'byproduct_flag',
                    xtype: 'checkbox',
                    inputValue: 'Y',
                    fieldLabel: '副产品标识'
                }),
                
                this.actualCost = new Ext.form.TextField({
                    name: 'actual_cost',
                    xtype: 'textfield',
                    fieldLabel: '实际成本'
                }),
                
                this.netUnit = new Rs.ext.form.Telescope({
                    name: 'net_unit',
                    fieldLabel: '净重单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                
                this.grossUnit = new Rs.ext.form.Telescope({
                    name: 'gross_unit',
                    fieldLabel: '毛重单位',
                    singleSelect: true,
                    width: 125,
                    progCode: 'unit',
                    valueField: 'UNIT_CODE',
                    displayField: 'UNIT_CODE'
                }), 
                this.taxRate = new Ext.form.TextField({
                    name: 'tax_rate',
                    fieldLabel: '税率'
                })]
            }]
        };

        config = Rs.apply(config || {},
        {
            trackResetOnLoad: true,
            frame: true,
            labelAlign: 'right',
            autoScroll: true,
            items: [unit]
        });
        rs.inv.MaterialFinancialCosts.superclass.constructor.call(this, config);
    }
});