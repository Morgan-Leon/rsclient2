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
	        	 * 实现刷新 滚动条位置不变
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
	        	//forceFit : true //让表格充满整个panel,这样不会出现滚动条
	        }, 
	        
	        colModel : new Rs.ext.grid.LockingColumnModel([sm,{
	        				id : 'warehouse_code' ,
	                        dataIndex : 'warehouse_code' ,
	                        header : "仓库编码" ,
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
												if(msg == "false"){ //表示数据重复
													Ext.Msg.alert("提示","仓库编码已存在");
												}
											}
										});
									}								
								},
								allowBlank : false ,
								blankText : '仓库编码必须输入',
								maxLength : 4 ,
								maxLengthText : '仓库编码最大长度为4位'
	                        })
	                    },{
	                        //locked : true,
	                        dataIndex : 'warehouse_name' ,
	                        header : "名称" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        //sortable : true,
	                        editor : true
	                    },{
	                        dataIndex : 'warehouse_addr' ,
	                        header : "仓库地址" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true
	                    },{
	                        dataIndex : 'mp_flag' ,
	                        header : "仓库类型" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Ext.form.ComboBox({
	                            triggerAction: 'all',
	                            displayField: 'name' ,
	                            valueField: 'value' ,
	                            mode : 'local' , //使用本地数据
	                            store : new Ext.data.JsonStore({
	                                fields : ['name' , 'value'] ,
	                                data : [
	                                    {name : '采购件库' , value : 'P'},                        
	                                    {name : '自制件库' , value : 'M'}                     
	                                    ]
	                            })
	                        }),
	                        renderer : function(v){
	                            if('P' == v){
	                                return "采购件库" ;
	                            }else if ('M' == v){
	                                return "自制件库" ;
	                            }else {
	                                return "" ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'management_flag' ,
	                        header : "管理方式" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true ,
	                        //下拉框
	                        editor : new Ext.form.ComboBox({
	                            triggerAction: 'all',
	                            displayField: 'name' ,
	                            valueField: 'value' ,
	                            mode : 'local' , //使用本地数据
	                            store : new Ext.data.JsonStore({
	                                fields : ['name' , 'value'] ,
	                                data : [
	                                    {name : '按仓库管理' , value : 'W'},                        
	                                    {name : '按货区管理' , value : 'B'},                     
	                                    {name : '按货位管理' , value : 'L'}                     
	                                    ]
	                            })
	                        }),
	                        renderer : function(v){
	                            if('W' == v){
	                                return "按仓库管理" ;
	                            } else if ('B' == v){
	                                return "按货区管理" ;
	                            } else if ('L' == v){
	                                return "按货位管理" 
	                            } else {
	                                return '' ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'total_qty_flag' ,
	                        header : "计划使用仓库" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "<span style='color:red'>是</span>" ;
	                            } else if ('N' == v){
	                                return "<span style='color:green'>否</span>" ;
	                            } else {
	                                return "" ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'negative_qty_flag' ,
	                        header : "允许负库存标记" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "是" ;
	                            } else if ('N' == v){
	                                return "否" ;
	                            } else {
	                                return "" ;
	                            }
	                        }                        
	                    },{
	                        dataIndex : 'check_bill_flag' ,
	                        header : "单据审核标记" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "是" ;
	                            } else if ('N' == v){
	                                return "否" ;
	                            } else {
	                                return "" ;
	                            }
	                        }                        
	                    },{
	                        dataIndex : 'now_period' ,
	                        header : "当前核算期" ,
	                        align : 'center' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Rs.ext.form.PeriodField({
	                            format : 'Y/m'
	                        })
	                    },{
	                        dataIndex : 'purchase_dept_code' ,
	                        header : "采购部门编码" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true
	                      
	                    },{
	                        dataIndex : 'purchase_dept_name' ,
	                        header : "采购部门名称" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new  Ext.Editor(new  Rs.ext.form.Telescope({
	                        	width : 160 , //与该单元格的宽度保持一致
	                            progCode : 'deptCode' ,
	                            singleSelect : true ,//单选望远镜
	                            valueField : 'DEPT_NAME' , //注意大写
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
	                        header : "月结控制" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Ext.form.ComboBox({
	                            triggerAction: 'all',
	                            displayField: 'type_desc' ,
	                            valueField: 'type_code' ,
	                            mode : 'remote' , //使用本地数据
	                            store : new Rs.ext.data.Store({
	                            	url : '/rsc/js/examples/inv2/warehouse/InvMonthCloseParam.rsc' ,
	                                fields : ['type_code' , 'type_desc']
	                            })
	                        }),
	                        renderer : function(v){
	                            if('N' == v){
	                                return "不控制" ;
	                            } else if('E' == v){
	                                return "核算期末" ;
	                            } else if('30' == v){
	                                return ">=30" ;
	                            } else {
	                                return '' ;
	                            }
	                        }
	                    },{
	                        dataIndex : 'set_code' ,
	                        header : "成套编码" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true
	                    },{
	                        dataIndex : 'set_name' ,
	                        header : "成套名称" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        editor : new Ext.Editor(new Rs.ext.form.Telescope({
	                        	width : 160 , //与该单元格的宽度保持一致
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
	                        header : "立体库标记" ,
	                        align : 'left' ,
	                        width : 160 ,
	                        sortable : true,
	                        renderer : function(v){
	                            if('Y' == v){
	                                return "是" ;
	                            } else if ('N' == v){
	                                return "否" ;
	                            } else {
	                                return "" ;
	                            }
	                        }                          
	                    },{
	                        dataIndex : 'changeover_date' ,
	                        header : "最近结转日期" ,
	                        align : 'center' ,
	                        width : 160 ,
	                        sortable : true                        
	                    },{
	                        dataIndex : 'num_of_kind' ,
	                        header : "种类数" ,
	                        align : 'right' ,
	                        width : 160 ,
	                        sortable : true                        
	                    }
	                ]),
	            //view: new Rs.ext.grid.LockingGridView(),
	            bbar : new Rs.ext.grid.SliderPagingToolbar({
	                pageSize : 20,  //初始化显示的条数
	                hasSlider : true,
	                store : store,
	                displayInfo : true,
	                displayMsg: '共{2}条'
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
	            Ext.Msg.alert("提示","请选择要删除的数据行");
	            return ;
	        }
	        Ext.Msg.show({
	        	title : '提示' ,
	        	msg: "确定要删除选中的记录吗?",
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