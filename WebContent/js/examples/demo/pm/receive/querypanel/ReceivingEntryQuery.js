Rs.define('rs.pm.ReceivingEntryQuery',{

    extend : Rs.ext.query.QueryPanel ,

    mixins : [Rs.app.Main] ,

    constructor : function(config){
         var conditions = [{
                dataIndex : 'special_class',
                header : '*�ɹ�����',
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
                header : '���յ���',
                hidden : false,
                editor : new Ext.form.TextField({})
            },{
                dataIndex : 'receive_date1',
                header : '��ʼ��������',
                hidden : false,
                editor : new Rs.ext.form.DateField({
                    format : 'Y/m/d' ,
                    listeners : {
                        change : {
                            fn : function(df , v ,ov){
                            	var value = this.getEditor('receive_date2').getValue() ; //��ȡ��ֹ��������
                                if(!( value == "")){ //��ʱ��ֹ����ʱ����ֵ��
                                    if(new Date(v) > new Date(value)){
                                        Ext.Msg.alert("��ʾ" , "��ʼ�������ڱ�������ֹ��������֮ǰ") ;
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
                header : '��ֹ��������',
                hidden : false,
                editor : new Rs.ext.form.DateField({
                    format : 'Y/m/d' ,
                    listeners : {
                        change : {
                            fn : function(df , v , ov){
                                var value = this.getEditor('receive_date1').getValue() ; //��ȡ��ʼ��������
                                if(!( value == "")){ //��ʱ��ʼ����ʱ����ֵ��
                                    if(new Date(v) < new Date(value)){
                                        Ext.Msg.alert("��ʾ" , "��ֹ�������ڱ�������ʼ��������֮��") ;
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
                header : '�ɹ�С��',
                hidden : false,
                editor : new Rs.ext.form.Telescope({
                    progCode : 'groupUser',
                    valueField : 'GROUP_ID',
                    singleSelect : true,
                    displayField : 'GROUP_NAME'
                })
            },{
                dataIndex : 'buyer_id',
                header : '�ɹ�Ա',
                hidden : false,
                editor : new Rs.ext.form.Telescope({
                    progCode : 'buyerCodeNew',
                    singleSelect : true,
                    valueField : 'PM_GROUP_USER.USER_UNIQUE_ID',
                    displayField : 'PM_USER.USER_NAME'
                })
            },{
                dataIndex : 'vendor_code',
                header : '��Ӧ��',
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
                                  Ext.Msg.alert("��ʾ",'����ѡ��ɹ�С��');
                                  return false;
                              }
                           },
                           scope : this
                        }
                    }
                })
            },{
                dataIndex : 'receive_status' ,
                header : '����״̬' ,
                editor : new Ext.form.ComboBox( {
                    triggerAction : 'all' ,
                    mode : 'local' ,
                    width : 125 ,
                    emptyText : '��ѡ��',
                    valueField : 'value' ,
                    displayField : 'name' ,
                    value : '' ,
                    store : new Ext.data.JsonStore({
                        fields : ['name' , 'value'] ,
                        data : [
                            {name : 'P-�������' , value : 'P'} ,
                            {name : 'N-����' , value : 'N'} 
                        ]
                    })
                })
                
            },{
                dataIndex : 'vendor_abv_' ,
            	header : '��Ӧ�̼��' ,
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
     * ��дdoQuery����  ����û�н�grid���ݹ��� ������Ҫ���¼�ע�ᵽ�¼�������,��grid����ɲ�ѯ����
     */
    doQuery : function(){
        var params = this.getParams();
        this.fireEvent("query", this, params);
    }
}) ;