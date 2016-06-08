Rs.define('rs.inv.NewAddLine', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [Rs.app.Main],
    
    constructor : function(config) {
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy : true,
            url: '/rsc/js/examples/inv2/warehouse/InsertNewLline.rsc',
            idProperty : 'warehouse_code',
            fields : ['warehouse_code','warehouse_name','warehouse_addr','mp_flag','management_flag','total_qty_flag','negative_qty_flag'
                        ,'check_bill_flag','now_period','purchase_dept_code','purchase_dept_name','month_close_flag','set_code','set_name'
                        ,'ltk_flag','num_of_kind','changeover_date'
            ]
        });
        
	    config = Rs.apply(config || {}, {
	        store : store,
	        colModel : new Rs.ext.grid.LockingColumnModel([new Ext.grid.RowNumberer(),{
	        				id : 'warehouse_code' ,
	                        dataIndex : 'warehouse_code' ,
	                        header : "�ֿ����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true ,
	                        editor : true
	                    },{
	                        dataIndex : 'warehouse_name' ,
	                        header : "����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        editor : true
	                    },{
	                        dataIndex : 'warehouse_addr' ,
	                        header : "�ֿ��ַ" ,
	                        align : 'left' ,
	                        width : 160 
	                    },{
	                        dataIndex : 'mp_flag' ,
	                        header : "�ֿ�����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        editor : new Ext.form.ComboBox({
	                            triggerAction: 'all',
	                            displayField: 'name' ,
	                            valueField: 'value' ,
	                            mode : 'local' , //ʹ�ñ�������
	                            store : new Ext.data.JsonStore({
	                                fields : ['name' , 'value'] ,
	                                data : [
	                                    {name : '�ɹ�����' , value : 'P'},                        
	                                    {name : '���Ƽ���' , value : 'M'}                     
	                                    ]
	                            })
	                        }),
	                        renderer : function(v){
	                            if('P' == v){
	                                return "�ɹ�����" ;
	                            }else if ('M' == v){
	                                return "���Ƽ���" ;
	                            }else {
	                                return "" ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'management_flag' ,
	                        header : "����ʽ" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true ,
	                        //������
	                        editor : new Ext.form.ComboBox({
	                            triggerAction: 'all',
	                            displayField: 'name' ,
	                            valueField: 'value' ,
	                            mode : 'local' , //ʹ�ñ�������
	                            store : new Ext.data.JsonStore({
	                                fields : ['name' , 'value'] ,
	                                data : [
	                                    {name : '���ֿ����' , value : 'W'},                        
	                                    {name : '����������' , value : 'B'},                     
	                                    {name : '����λ����' , value : 'L'}                     
	                                    ]
	                            })
	                        }),
	                        renderer : function(v){
	                            if('W' == v){
	                                return "���ֿ����" ;
	                            } else if ('B' == v){
	                                return "����������" ;
	                            } else if ('L' == v){
	                                return "����λ����" 
	                            } else {
	                                return '' ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'total_qty_flag' ,
	                        header : "�ƻ�ʹ�òֿ�" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "<span style='color:red'>��</span>" ;
	                            } else if ('N' == v){
	                                return "<span style='color:green'>��</span>" ;
	                            } else {
	                                return "" ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'negative_qty_flag' ,
	                        header : "���������" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "��" ;
	                            } else if ('N' == v){
	                                return "��" ;
	                            } else {
	                                return "" ;
	                            }
	                        }                        
	                    },{
	                        dataIndex : 'check_bill_flag' ,
	                        header : "������˱��" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "��" ;
	                            } else if ('N' == v){
	                                return "��" ;
	                            } else {
	                                return "" ;
	                            }
	                        }                        
	                    },{
	                        dataIndex : 'now_period' ,
	                        header : "��ǰ������" ,
	                        align : 'center' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Rs.ext.form.PeriodField({
	                            format : 'Y/m'
	                        })
	                    },{
	                        dataIndex : 'purchase_dept_code' ,
	                        header : "�ɹ����ű���" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true
	                      
	                    },{
	                        dataIndex : 'purchase_dept_name' ,
	                        header : "�ɹ���������" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new  Ext.Editor(new  Rs.ext.form.Telescope({
	                        	width : 160 , //��õ�Ԫ��Ŀ�ȱ���һ��
	                            progCode : 'deptCode' ,
	                            singleSelect : true ,//��ѡ��Զ��
	                            valueField : 'DEPT_NAME' , //ע���д
	                            displayField : 'DEPT_NAME' 
	                        }),{
	                            listeners : {
	                                complete : function(e,v,ov){
	                                	if(this.field.selectedRecord){
		                                    this.record.set('purchase_dept_code',this.field.selectedRecord.get('DEPT_CODE')) ;
	                                	}
	                                }
	                            } ,
	                            scope : this 
	                        })
	                    },{
	                        dataIndex : 'month_close_flag' ,
	                        header : "�½����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Ext.form.ComboBox({
	                            triggerAction: 'all',
	                            displayField: 'type_desc' ,
	                            valueField: 'type_code' ,
	                            mode : 'remote' , //ʹ�ñ�������
	                            store : new Rs.ext.data.Store({
	                            	url : '/rsc/js/examples/inv2/warehouse/InvMonthCloseParam.rsc' ,
	                                fields : ['type_code' , 'type_desc']
	                            })
	                        }),
	                        renderer : function(v){
	                            if('N' == v){
	                                return "������" ;
	                            } else if('E' == v){
	                                return "������ĩ" ;
	                            } else if('30' == v){
	                                return ">=30" ;
	                            } else {
	                                return '' ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'set_code' ,
	                        header : "���ױ���" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true
	                    },{
	                        dataIndex : 'set_name' ,
	                        header : "��������" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Ext.Editor(new Rs.ext.form.Telescope({
	                        	width : 160 , //��õ�Ԫ��Ŀ�ȱ���һ��
	                            progCode : 'pmWare' ,
	                            valueField : 'WAREHOUSE_NAME' ,
	                            singleSelect : true,
	                            displayField : 'WAREHOUSE_NAME'
	                        }), {
	                            listeners : {
	                                complete : function(e, v, ov){
	                                	if(this.field.selectedRecord){
	                                    	var name = this.field.selectedRecord.get('WAREHOUSE_CODE')
	                                    	this.record.set("set_code", name);
	                                	}
	                                }
	                            },
	                            scope : this
	                        })
	                    },{
	                        dataIndex : 'ltk_flag' ,
	                        header : "�������" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "��" ;
	                            } else if ('N' == v){
	                                return "��" ;
	                            } else {
	                                return "" ;
	                            }
	                        }                          
	                    },{
	                        dataIndex : 'changeover_date' ,
	                        header : "�����ת����" ,
	                        align : 'center' ,
	                        width : 160 ,
	                        sortable : true                        
	                    },{
	                        dataIndex : 'num_of_kind' ,
	                        header : "������" ,
	                        align : 'right' ,
	                        width : 160 ,
	                        sortable : true                        
	                    }
	                ])
	        });
	        
	        rs.inv.NewAddLine.superclass.constructor.call(this, config);
	        
	    },
	    
	    onRender : function(){
	        rs.inv.NewAddLine.superclass.onRender.apply(this, arguments);
	    }
});