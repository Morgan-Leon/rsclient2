Rs.define('rs.app.template.maintenance.DocumentHead', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    
        config = Rs.apply(config || {}, {
            layout : 'column',
            height : 150,
            width : 928,
            bodyStyle : 'padding:5px;',
            items : [{
                layout : 'form', 
                border : false,
                columnWidth : .3,
                items : [ this.bt = new Rs.ext.form.Telescope({
                    //id : 'bill_type',
                    fieldLabel : '*交易类型',
                    singleSelect : true,
                    width : 125,
                    labelStyle: 'text-align:right;',
                    progCode : 'billType',
                    valueField : 'BILL_TYPE',
                    displayField : 'TYPE_DESC'
                }),this.rn = new Ext.form.TextField({
                    //id:'receive_no',
                    width : 125,
                    labelStyle: 'text-align:right;',
                    fieldLabel : '*接收单号'
                }), this.vc = new Rs.ext.form.Telescope({
                    //id : 'vendor_code',
                    fieldLabel : '*供应商',
                    singleSelect : true,
                    labelStyle: 'text-align:right;',
                    progCode : 'tempUserVendor',
                    valueField : 'PM_GROUP_VENDOR.VENDOR_CODE',
                    displayField : 'PM_VENDOR.VENDOR_ABV',
                    buildProgCondtion : (function(progCondition, qp){
                        return "pm_group_vendor.group_id = '" + qp.gi.getValue() + "'" + (Ext.isEmpty(progCondition, false)?"": " AND " + progCondition);
                    }).createDelegate(this,[this],2),
                    listeners : {
                        beforeexpand : {
                           fn : function(){
                              if(!this.gi.getValue() || this.gi.getValue().length<1){
                                  Ext.Msg.alert("提示",'请先选择采购小组');
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
                items : [this.sc = new Ext.form.ComboBox( {
                    mode : 'remote',
                    fieldLabel : '*采购类型',
                    labelStyle: 'text-align:right;',
                    //id : 'special_class',
                    width : 125,
                    triggerAction: 'all',
                    store: new Rs.ext.data.Store({
                        url : '/rsc/js/examples/app/template/maintenance/m3/pmclassservice.rsc',
                        autoLoad : false,//true,
                        fields: [
                            'special_class',
                            'special_name'
                        ]
                    }),
                    valueField: 'special_class',
                    displayField: 'special_name'
                }), this.gi = new Rs.ext.form.Telescope({
                    //id : 'group_id',
                    fieldLabel : '*采购小组',
                    labelStyle: 'text-align:right;',
                    singleSelect : true,
                    progCode : 'groupUser',
                    valueField : 'GROUP_ID',
                    displayField : 'GROUP_NAME'
                }), this.dc = new Rs.ext.form.Telescope({
                    //id : 'deliver_code',
                    fieldLabel : '*送货单位',
                    labelStyle: 'text-align:right;',
                    singleSelect : true,
                    progCode : 'relVendor',
                    valueField : 'PARTNER_CODE',
                    displayField : 'PARTNER_ABV',
                    buildProgCondtion : (function(progCondition, qp){
                        return "vendor_code = '" + qp.vc.getValue() + "'" + (Ext.isEmpty(progCondition, false)?"": " AND " + progCondition);
                    }).createDelegate(this,[this],2),
                    listeners : {
                        beforeexpand : {
                           fn : function(){
                              if(!this.vc.getValue() || this.vc.getValue().length<1){
                                  Ext.Msg.alert("提示",'请先选择供应商');
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
                    items : [this.rd = new Ext.form.DateField({
                        //id : 'receive_date',
                        fieldLabel : '*接收日期',
                        labelStyle: 'text-align:right;',
                        width : 125,
                        format : 'Y/m/d'
                    }), this.bc = new Rs.ext.form.Telescope({
                        fieldLabel : '*采购员',
                        labelStyle: 'text-align:right;',
                        progCode : 'buyerCode',
                        valueField : 'PM_GROUP_USER.USER_UNIQUE_ID',
                        displayField : 'PM_USER.USER_NAME',
                        gridWidth : 450,
                        singleSelect : true,
                        value: '001',
                        buildProgCondtion : function(con){
                            return con;
                        }
                    })]}],
            tbar : new Ext.Toolbar({
                items : [{
                    text : '新增',
                    iconCls : 'rs-action-create',
                    scope : this,
                    handler : function(){
                        this.fireEvent('reset',this);
                    }
                },{
                    text : '删除',
                    iconCls : 'rs-action-remove',
                    scope : this
                },{
                    text : '保存',
                    iconCls : 'rs-action-save',
                    scope : this,
                    handler : this.save
                },{
                    text : '成批接收',
                    iconCls : 'rs-action-batch',
                    scope : this
                },{
                    text : '例外信息',
                    iconCls : 'rs-action-exception',
                    scope : this
                }]
            })
        });

        rs.app.template.maintenance.DocumentHead.superclass.constructor.call(this, config);
        this.addEvents('save', 'reset');
        Rs.EventBus.register(this, 'documenthead', ['save']);
        
    },
    
    setData : function(rec){
        /*rec.fields.eachKey(function(key){
            var p = this.findById(key);
            if(p){
                p.setValue(rec.get(key));
            }
        },this);*/
        this.bt.setValue(rec.get('bill_type'));
        this.rn.setValue(rec.get('receive_no'));
        this.bc.setValue(rec.get('buyer_id'));
        this.gi.on('change', this.vc.setValue.createDelegate(this.vc,[rec.get('vendor_code')]),this,{single : true});
        this.vc.on('change', this.dc.setValue.createDelegate(this.dc,[rec.get('deliver_code')]),this,{single : true});
        var scstore = this.sc.getStore();
        scstore.on('load',this.sc.setValue.createDelegate(this.sc,[rec.get('special_class')]), this, {single : true});
        scstore.load();
        this.gi.setValue(rec.get('group_id'));
        this.rd.setValue(rec.get('receive_date'));
    },
    
    resetData : function(){
        this.bt.setValue('');
        this.bc.setValue('');
        this.rn.setValue('');
        this.sc.setValue('');
        this.gi.setValue('');
        this.dc.setValue('');
        this.rd.setValue('');
        this.vc.setValue('');
    },
    
    save : function(){
        var params = {};
        params['receive_no'] = this.rn.getValue();
        if(!params['receive_no']){
            Ext.Msg.alert('提示','请填写接收单号');
            return;
        }
        params['bill_type'] = this.bt.getValue();
        params['special_class'] = this.sc.getValue();
        params['group_id'] = this.gi.getValue();
        params['deliver_code'] = this.dc.getValue();
        params['receive_date'] = this.rd.getValue()?this.rd.getValue().format('Y-m-d'):'';
        params['vendor_code'] = this.vc.getValue();
        alert(params);
        this.fireEvent('save', params['receive_no']);
    }
});