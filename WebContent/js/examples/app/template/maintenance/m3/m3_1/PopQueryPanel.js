Rs.define('rs.app.template.maintenance.PopQueryPanel', {
    
    extend : Rs.ext.query.QueryPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
         var conditions = [{
                dataIndex : 'special_class',
                header : '*采购分类',
                hidden : false,
                editor : new Ext.form.ComboBox( {
                    mode : 'remote',
                    //typeAhead: true,
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
                })
            }, {
                dataIndex : 'receive_no',
                header : '接收单号',
                hidden : false,
                editor : new Ext.form.TextField({})
            }, {
                dataIndex : 'receive_date1',
                header : '起始接收日期',
                hidden : false,
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'receive_date2',
                header : '终止接收日期',
                hidden : false,
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'group_id',
                header : '采购小组',
                hidden : false,
                editor : new Rs.ext.form.Telescope({
                    progCode : 'groupUser',
                    valueField : 'GROUP_ID',
                    singleSelect : true,
                    displayField : 'GROUP_NAME'
                })
            },{
                dataIndex : 'buyer_id',
                header : '采购员',
                hidden : false,
                editor : new Rs.ext.form.Telescope({
                    progCode : 'buyerCode',
                    singleSelect : true,
                    valueField : 'PM_GROUP_USER.USER_UNIQUE_ID',
                    displayField : 'PM_USER.USER_NAME'
                })
            },{
                dataIndex : 'vendor_code',
                header : '供应商',
                hidden : false,
                editor : new Rs.ext.form.Telescope({
                    progCode : 'tempUserVendor',
                    singleSelect : true,
                    valueField : 'PM_GROUP_VENDOR.VENDOR_CODE',
                    displayField : 'PM_VENDOR.VENDOR_ABV',
                    buildProgCondtion : (function(progCondition, qp){
                        return "pm_group_vendor.group_id = '" + qp.getEditor('group_id').getValue() + "'" + (Ext.isEmpty(progCondition, false)?"": " AND " + progCondition);
                    }).createDelegate(this,[this],2),
                    listeners : {
                        beforeexpand : {
                           fn : function(){
                              if(!this.getEditor('group_id').getValue() || this.getEditor('group_id').getValue().length<1){
                                  Ext.Msg.alert("提示",'请先选择采购小组');
                                  return false;
                              }
                           },
                           scope : this
                        }
                    }
                })
            }];
             
             var plugin = new Rs.ext.state.StatePlugin( { 
                 scheme : 10
             });
         
            config = Rs.apply(config || {}, {
                conditions : conditions,
                autoHeight : false,
                isPop : true,
                bbar : new Ext.Toolbar({
                    items : ["->", plugin.button]
                }),
                stateId : 'ltest',
                plugins : plugin,
                setValue : function(vobject){
                    for(var p in vobject){
                        var cp = this.findById(this.editors[p]);
                        if(p == 'special_class'){
                            var scstore = cp.getStore();
                            scstore.on('load',cp.setValue.createDelegate(cp,[vobject['special_class']]), this, {single : true});
                            scstore.load();
                        } else{
                            cp.setValue(vobject[p]);
                        }
                    }
                }
            });

        rs.app.template.maintenance.PopQueryPanel.superclass.constructor.call(this, config);
        
        Rs.EventBus.register(this, 'popquerypanel', ['query']);
        Rs.EventBus.register(this, 'popquerypanel', ['reset']);
    }
});