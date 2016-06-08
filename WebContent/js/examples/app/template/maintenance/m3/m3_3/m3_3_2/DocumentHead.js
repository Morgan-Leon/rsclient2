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
                    fieldLabel : '*��������',
                    width : 125,
                    labelSeparator :'',
                    progCode : 'billType',
                    valueField : 'BILL_TYPE',
                    displayField : 'TYPE_DESC'
                }),new Ext.form.TextField({
                    id:'receive_no',
                    width : 125,
                    fieldLabel : '*���յ���',
                    labelSeparator :''
                }), new Rs.ext.form.GridLoaderField({
                    id : 'vendor_code',
                    fieldLabel : '*��Ӧ��',
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
                                  alert('����ѡ��ɹ�С��');
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
                    fieldLabel : '*�ɹ�����',
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
                    fieldLabel : '*�ɹ�С��',
                    labelSeparator :'',
                    progCode : 'groupUser',
                    valueField : 'GROUP_ID',
                    displayField : 'GROUP_NAME'
                }), new Rs.ext.form.GridLoaderField({
                    id : 'deliver_code',
                    fieldLabel : '*�ͻ���λ',
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
                                  alert('����ѡ��Ӧ��');
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
                        fieldLabel : '*��������',
                        width : 125,
                        labelSeparator :'',
                        format : 'y/m/d'
                    }), new Rs.ext.form.GridLoaderField({
                        id : 'buyer_code',
                        fieldLabel : '*�ɹ�Ա',
                        labelSeparator :'',
                        progCode : 'buyerCode',
                        valueField : 'BUYER_CODE',
                        displayField : 'BUYER_NAME'
                    })]}],
            tbar : new Ext.Toolbar({
                items : [{
                    text : '����',
                    iconCls : 'rs-action-create',
                    scope : this
                },{
                    text : 'ɾ��',
                    iconCls : 'rs-action-remove',
                    scope : this
                },{
                    text : '����',
                    iconCls : 'rs-action-save',
                    scope : this
                },{
                    text : '��������',
                    iconCls : 'rs-action-create',
                    scope : this
                },{
                    text : '������Ϣ',
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