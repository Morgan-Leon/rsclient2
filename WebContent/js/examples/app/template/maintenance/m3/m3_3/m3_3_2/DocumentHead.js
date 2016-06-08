Rs.define('rs.app.template.maintenance.DocumentHead', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    
        config = Rs.apply(config || {}, {
            layout : 'column',
            height : 150,
            width : 928,
            items : [{
                layout : 'form', 
                border : false,
                columnWidth : .3,
                items : [ new Rs.ext.form.GridLoaderField({
                    id : 'bill_type',
                    fieldLabel : '*交易类型',
                    width : 125,
                    labelSeparator :'',
                    progCode : 'billType',
                    valueField : 'BILL_TYPE',
                    displayField : 'TYPE_DESC'
                }),new Ext.form.TextField({
                    id:'receive_no',
                    width : 125,
                    fieldLabel : '*接收单号',
                    labelSeparator :''
                }), new Rs.ext.form.GridLoaderField({
                    id : 'vendor_code',
                    fieldLabel : '*供应商',
                    labelSeparator :'',
                    progCode : 'userVendor',
                    valueField : 'VENDOR_CODE',
                    displayField : 'VENDOR_ABV',
                    buildProgCondtion : (function(progCondition, qp){
                        return "pm_group_vendor.group_id = '" + qp.findById('group_id').getValue() + "'" + (Ext.isEmpty(progCondition, false)?"": " AND " + progCondition);
                    }).createDelegate(this,[this],2),
                    listeners : {
                        beforeexpand : {
                           fn : function(){
                              if(!this.findById('group_id').getValue() || this.findById('group_id').getValue().length<1){
                                  alert('请先选择采购小组');
                                  return false;
                              }
                           },
                           scope : this
                        }
                    }
                })]},{
                layout : 'form', 
                border : false,
                columnWidth : .3,
                items : [new Ext.form.ComboBox( {
                    mode : 'remote',
                    fieldLabel : '*采购类型',
                    labelSeparator :'',
                    width : 125,
                    triggerAction: 'all',
                    store: new Rs.ext.data.Store({
                        url : 'pmclassservice.jsp',
                        autoLoad : true,
                        fields: [
                            'special_class',
                            'special_name'
                        ]
                    }),
                    valueField: 'special_class',
                    displayField: 'special_name'
                }), new Rs.ext.form.GridLoaderField({
                    id : 'group_id',
                    fieldLabel : '*采购小组',
                    labelSeparator :'',
                    progCode : 'groupUser',
                    valueField : 'GROUP_ID',
                    displayField : 'GROUP_NAME'
                }), new Rs.ext.form.GridLoaderField({
                    id : 'deliver_code',
                    fieldLabel : '*送货单位',
                    labelSeparator :'',
                    progCode : 'relVendor',
                    valueField : 'PARTNER_CODE',
                    displayField : 'PARTNER_ABV',
                    buildProgCondtion : (function(progCondition, qp){
                        return "vendor_code = '" + qp.findById('vendor_code').getValue() + "'" + (Ext.isEmpty(progCondition, false)?"": " AND " + progCondition);
                    }).createDelegate(this,[this],2),
                    listeners : {
                        beforeexpand : {
                           fn : function(){
                              if(!this.findById('vendor_code').getValue() || this.findById('vendor_code').getValue().length<1){
                                  alert('请先选择供应商');
                                  return false;
                              }
                           },
                           scope : this
                        }
                    }
                })]},{
                    layout : 'form', 
                    border : false,
                    columnWidth : .4,
                    items : [new Ext.form.DateField({
                        fieldLabel : '*接收日期',
                        width : 125,
                        labelSeparator :'',
                        format : 'y/m/d'
                    }), new Rs.ext.form.GridLoaderField({
                        id : 'buyer_code',
                        fieldLabel : '*采购员',
                        labelSeparator :'',
                        progCode : 'buyerCode',
                        valueField : 'BUYER_CODE',
                        displayField : 'BUYER_NAME'
                    })]}],
            tbar : new Ext.Toolbar({
                items : [{
                    text : '新增',
                    iconCls : 'rs-action-create',
                    scope : this
                },{
                    text : '删除',
                    iconCls : 'rs-action-remove',
                    scope : this
                },{
                    text : '保存',
                    iconCls : 'rs-action-save',
                    scope : this
                },{
                    text : '成批接收',
                    iconCls : 'rs-action-create',
                    scope : this
                },{
                    text : '例外信息',
                    iconCls : 'rs-action-remove',
                    scope : this
                }]
            })
        });

        rs.app.template.maintenance.DocumentHead.superclass.constructor.call(this, config);
        
        this.addEvents('dataset');
        
        Rs.EventBus.on('maintainpanel-modify', this.setData, this);
    }
});