Rs.define('rs.pm.ReceivingEntryQuery',{

    extend : Rs.ext.query.QueryPanel ,

    mixins : [Rs.app.Main] ,

    constructor : function(config){
         var conditions = [{
                dataIndex : 'special_class',
                header : '*采购分类',
                editor : new Ext.form.ComboBox( {
                    mode : 'remote',
                    triggerAction: 'all',
                    store: new Rs.ext.data.Store({
                        url : '/rsc/js/examples/demo/pm/receive/pmclassservice.rsc',
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
            },{
                dataIndex : 'receive_date1',
                header : '起始接收日期',
                hidden : false,
                editor : new Rs.ext.form.DateField({
                    format : 'Y/m/d' ,
                    listeners : {
                        change : {
                            fn : function(df , v ,ov){
                            	var value = this.getEditor('receive_date2').getValue() ; //获取终止接收日期
                                if(!( value == "")){ //此时终止日期时间有值了
                                    if(new Date(v) > new Date(value)){
                                        Ext.Msg.alert("提示" , "起始接收日期必须在终止接收日期之前") ;
                                        this.getEditor('receive_date1').setValue(ov);
                                    }
                                }
                            } ,                 
                            scope : this 
                        }       
                    }
                })
            },{
                dataIndex : 'receive_date2',
                header : '终止接收日期',
                hidden : false,
                editor : new Rs.ext.form.DateField({
                    format : 'Y/m/d' ,
                    listeners : {
                        change : {
                            fn : function(df , v , ov){
                                var value = this.getEditor('receive_date1').getValue() ; //获取起始接收日期
                                if(!( value == "")){ //此时起始日期时间有值了
                                    if(new Date(v) < new Date(value)){
                                        Ext.Msg.alert("提示" , "终止接收日期必须在起始接收日期之后") ;
                                        this.getEditor('receive_date2').setValue(ov);
                                    }
                                }
                            } , 
                            scope : this
                        }
                    }
                })
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
                    progCode : 'buyerCodeNew',
                    singleSelect : true,
                    valueField : 'PM_GROUP_USER.USER_UNIQUE_ID',
                    displayField : 'PM_USER.USER_NAME'
                })
            },{
                dataIndex : 'vendor_code',
                header : '供应商',
                editor : new Rs.ext.form.Telescope({
                    progCode : 'tempUserVendorNew',
                    singleSelect : true,
                    valueField : 'PM_GROUP_VENDOR.VENDOR_CODE',
                    displayField : 'PM_VENDOR.VENDOR_ABV',
                    buildProgCondtion: (function(progCondition, qp) {
                        return "pm_group_vendor.group_id = '" + qp.getEditor('group_id').getValue() + "'" + (Ext.isEmpty(progCondition, false) ? "": " AND " + progCondition);
                    }).createDelegate(this, [this], 2),
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
            },{
                dataIndex : 'receive_status' ,
                header : '接收状态' ,
                editor : new Ext.form.ComboBox( {
                    triggerAction : 'all' ,
                    mode : 'local' ,
                    width : 125 ,
                    emptyText : '请选择',
                    valueField : 'value' ,
                    displayField : 'name' ,
                    value : '' ,
                    store : new Ext.data.JsonStore({
                        fields : ['name' , 'value'] ,
                        data : [
                            {name : 'P-部分完成' , value : 'P'} ,
                            {name : 'N-新增' , value : 'N'} 
                        ]
                    })
                })
                
            },{
                dataIndex : 'vendor_abv_' ,
            	header : '供应商简称' ,
            	editor : new Ext.form.TextField()
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
                stateId : 'pm4700_templete',
                plugins : plugin
            });

        rs.pm.ReceivingEntryQuery.superclass.constructor.call(this,config) ;
        
        Rs.EventBus.register(this, 'querypanel', ['query']);
    } ,
    /**
     * @method doQuery
     * 重写doQuery操作  这里没有将grid传递过来 所以需要将事件注册到事件总线上,由grid来完成查询操作
     */
    doQuery : function(){
        var params = this.getParams();
        this.fireEvent("query", this, params);
    }
}) ;