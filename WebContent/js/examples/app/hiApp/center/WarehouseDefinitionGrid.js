Rs.define('rs.inv.WarehouseDefinitionGrid', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [Rs.app.Main],
    

    constructor : function(config) {
    	
        var store = new Rs.ext.data.Store({
    
            autoLoad : true,
            
            autoDestroy : true,
            
            url: '/rsc/js/examples/demo/inv/warehouse/WarehouseDefinitionGridDataService.rsc',
            
            idProperty : 'warehouse_code',
            
            fields : ['warehouse_code','warehouse_name','warehouse_addr','mp_flag','management_flag','total_qty_flag','negative_qty_flag'
                        ,'check_bill_flag','now_period','purchase_dept_code','purchase_dept_name','month_close_flag','set_code','set_name'
                        ,'ltk_flag','num_of_kind','changeover_date'
            ]
            
        });
        store.on('load',function(store,record,option){
        	this.insertNewLine();
        },this) ;
        
	    var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
	    	//locked: true
	    });
	    
	    
	    Ext.QuickTips.init() ;
		    
		Ext.form.Field.prototype.msgTarget = 'side' ;
	    
	    config = Rs.apply(config || {}, {
	        store : store,
	        sm : sm,
	        viewConfig : {
	        	/**
	        	 * ʵ��ˢ�� ������λ�ò���
	        	 */
				onLoad : Ext.emptyFn,
				listeners : {
					beforerefresh : function(v) {
						v.scrollTop = v.scroller.dom.scrollTop;
						v.scrollHeight = v.scroller.dom.scrollHeight;
					},
					refresh : function(v) {
						v.scroller.dom.scrollTop = v.scrollTop
								+ (v.scrollTop == 0
										? 0
										: v.scroller.dom.scrollHeight
												- v.scrollHeight);
					}
				}	        
	        	//forceFit : true //�ñ���������panel,����������ֹ�����
	        }, 
	        
	        colModel : new Rs.ext.grid.LockingColumnModel([sm,{
	        				id : 'warehouse_code' ,
	                        dataIndex : 'warehouse_code' ,
	                        header : "�ֿ����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        //locked : true,
	                        sortable : true ,
	                        editor : new Ext.form.TextField({
	                        	id : 'code' ,
	                        	size : 4 ,
								listeners : {
									'change' : function(textField,newValue,oldValue){
										var service = new Rs.data.Service({
											url : '/rsc/js/examples/demo/inv/warehouse/WarehouseDefinitionGridDataService.jsp',
											method : 'check',
											accept : 'text'
										});
										service.call( {
											params : { warehouse_code : newValue},
											success : function(msg) {
												if(msg == "false"){ //��ʾ�����ظ�
													Ext.Msg.alert("��ʾ","�ֿ�����Ѵ���");
												}
											}
										});
									}								
								},
								allowBlank : false ,
								blankText : '�ֿ�����������',
								maxLength : 4 ,
								maxLengthText : '�ֿ������󳤶�Ϊ4λ'
	                        })
	                    },{
	                        //locked : true,
	                        dataIndex : 'warehouse_name' ,
	                        header : "����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        //sortable : true,
	                        editor : true
	                    },{
	                        dataIndex : 'warehouse_addr' ,
	                        header : "�ֿ��ַ" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true
	                    },{
	                        dataIndex : 'mp_flag' ,
	                        header : "�ֿ�����" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
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
	                        sortable : true,
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
	                ]),
	            //view: new Rs.ext.grid.LockingGridView(),
	            bbar : new Rs.ext.grid.SliderPagingToolbar({
	                pageSize : 20,  //��ʼ����ʾ������
	                hasSlider : true,
	                store : store,
	                displayInfo : true,
	                displayMsg: '��{2}��'
	            })
	        });
	        
	        rs.inv.WarehouseDefinitionGrid.superclass.constructor.call(this, config);
	        
	        Rs.EventBus.on('warehouseQuery-delete', this.deleteRecord, this);
	        Rs.EventBus.on('warehouseQuery-save', this.doSave, this);
	        Rs.EventBus.on('popquerypanel-query',this.doQuery ,this); 
	        
	    },
	    
	    onRender : function(){
	        rs.inv.WarehouseDefinitionGrid.superclass.onRender.apply(this, arguments);
	    },
	    
	    insertNewLine : function(){
			var record = new this.store.recordType();
			record.data = {};
			var keys = this.store.fields.keys;
			for(var i=0;i<keys.length;i++){
			    record.data[keys[i]] = '';
			}
			this.stopEditing();
			this.store.insert(this.store.getCount(),record);
			record.dirty = false ;
	    } ,
	    
	    deleteRecord : function(){
	        var selects = this.getSelectionModel().getSelections();
	        if(!selects || selects.length<1){
	            Ext.Msg.alert("��ʾ","��ѡ��Ҫɾ����������");
	            return ;
	        }
	        Ext.Msg.show({
	        	title : '��ʾ' ,
	        	msg: "ȷ��Ҫɾ��ѡ�еļ�¼��?",
	            buttons: Ext.Msg.OKCANCEL,
	            fn: function(b){
	                if(b=='cancel'){
	                    return;
	                }
	                this.store.remove(selects);
	                
	                this.checkModifyRecord(this.store);
		        
		            this.store.save() ;
		            this.store.reload() ;
	            },
	            scope : this,
	            icon: Ext.MessageBox.QUESTION
	        }) ;
	    },
	    
	    doSave : function(){
		        var modifyRecords = this.checkModifyRecord(this.store);
		        
		    	if(modifyRecords.length > 0){
		            this.store.save() ;
		            this.store.reload() ;
		    	}
	    } ,
	    
	    doQuery : function(qp, params){
	            this.getStore().reload({params : params});
	    },
	    
	    checkModifyRecord :function(store){
	    	var modifyRecords = store.getModifiedRecords();
		    	for(var i=0,len=modifyRecords.length;i<len;i++){
		    		var record = modifyRecords[i] ;
		    		var data = record.data ;
		    		if(record.dirty == false){
						modifyRecords.remove(record);
						break ;
		    		}
		    }
		    return modifyRecords ;
	    }
});