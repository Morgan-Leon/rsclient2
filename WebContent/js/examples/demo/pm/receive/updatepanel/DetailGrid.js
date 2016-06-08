Rs.define('rs.pm.DetailGrid', {
    
    extend : Ext.grid.EditorGridPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    	
    	//启动悬停事件
        Ext.QuickTips.init();
    	
		this.url = '/rsc/js/examples/demo/pm/receive/detailservice.rsc' ;
		
        var store = new Rs.ext.data.Store({
        	autoDestroy : true ,
            url : this.url ,
            idProperty : 'key' ,
            fields: ['rs_id','receive_no','seq_no','bill_type','type_desc','special_class','type_class',
                    'return_flag','order_no','order_seq_no','free_flag','coop_flag','item_style','item_code',
                    'item_name','request_date','pm_unit','pm_unit_name','manufacturer_code','manufacturer_name',
                    'manufacturer_abv','receiver_code','receiver_name','receiver_abv','biller_code',
                    'biller_name','biller_abv','vendor_code','vendor_name','vendor_abv','receive_date',
                    'receive_qty','receive_price','receive_amt','actual_days','second_unit','second_unit_name',
                    'second_receive_qty','assist_unit','assist_unit_name','assist_receive_qty','quality_flag',
                    'quality_qty','assist_quality_qty','qc_bill_no','stock_qty','assist_stock_qty','receive_note',
                    'invoice_flag','invoice_qty','invoice_amt','ontime_flag','record_date','recorder_id','recorder_code',
                    'recorder_name','buyer_id','buyer_code','buyer_name','org_id','group_id',
                    'dept_code','group_name','currency_code','currency_name','exchange_rate','tax_code',
                    'tax_desc','tax_rate','set_code','set_name','child_qty','end_flag','warehouse_code',
                    'warehouse_name','check_finish_flag','qc_create_flag','qc_select_flag','ship_qty',
                    'ship_date','check_time','check_man_name','check_man_code','check_man_id','scrap_qty',
                    'givein_quality_qty','customer_order_no','customer_name','receive_type',
                    'receive_status','check_date','inv_apply_date','key']
         });
        
		/**
		 * @listeners load 监听load事件
		 * @function this.createNewLine() 新增一行
		 */ 
        store.on('load', function(){
         	this.createNewLine();
        },this);   
        
        var totalSummary = new Rs.ext.grid.HybridGridSummary();
        
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        	width: 24
        });
        
        config = Rs.apply(config || {}, {
        	title : '明细面板' ,
            height : 330,
            width : 820,
            sm : sm,
            store : store,
            clicksToEdit : 1 ,
            stripeRows : true ,
            border : 0 ,
            colModel : new Ext.grid.ColumnModel([sm,{
                dataIndex : 'seq_no' ,
				id : 'seq_no' ,
                header : '*行号' ,
                sortable : true,
                align : 'right' ,
                editor : this.seqNoEditor = new Ext.Editor(new Ext.form.NumberField({
                }) , {
					autoSize : true
				})
            },{
				id : 'item_style' ,
            	dataIndex : 'item_style' ,
            	header : '*行类型' ,
            	editor : this.itemStyleEditor = {
            	   xtype : 'combo' ,
            	   mode : 'local' ,
            	   displayField : 'name' ,
            	   valueField : 'value' ,
            	   triggerAction : 'all' ,
            	   store : new Ext.data.JsonStore({
            	       fields : ['name','value'] ,
            	       data : [
            	           {name : '物资' ,value : 'M'} ,
            	           {name : '费用' ,value : 'F'} 
            	       ]
            	   })
            	} ,
            	renderer : function(v){
            	   if(v == 'M'){
            	       return '物资' ;
            	   } else if(v == 'F') {
            	       return '费用' ;
            	   } else {
            	       return '' ;
            	   }
            	} 
            },{
                dataIndex : 'free_flag' ,
                header : '免费' ,
                editor : new Ext.Editor(new Ext.form.ComboBox({
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   value : 'N' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '是' ,value : 'Y'} ,
                           {name : '否' ,value : 'N'} 
                       ]
                   })
                }),{
                	autoSize : true
                }) ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '是' ;
                   } else {
                       return '否' ;
                   }
                }
            },{
                id : 'item_code' ,
                dataIndex : 'item_code' ,
                header : "*物料编码" ,
                align : 'left' ,
                width : 160 ,
                sortable : true,
                editor : this.itemCodeEditor = new  Ext.Editor(new  Rs.ext.form.Telescope({
                    progCode : 'itemPmNew2' ,
                    singleSelect : true ,//单选望远镜
                    valueField : 'A.ITEM_CODE' , //注意大写
                    displayField : 'A.ITEM_CODE' 
                }),{
                    listeners : {
                        complete : function(e,v,ov){
                        	var selectRecord = this.field.selectedRecord ;
                            if(selectRecord){
                            	//反填物料名称
                                this.record.set('item_name',selectRecord.get('A.ITEM_NAME')) ;
                                //反填计量单位
                                this.record.set('pm_unit',selectRecord.get('A.PM_UNIT')) ;
                                //反填辅助计量单位
                                this.record.set('assist_unit',selectRecord.get('A.ASSIST_UNIT')) ;
                                //反填仓库编码
                                this.record.set('warehouse_code',selectRecord.get('A.WAREHOUSE_CODE')) ;
                            }
                        }
                    } ,
                    autoSize : true,
                    scope : this 
                })
            },{
                header : '物料名称',
                dataIndex : 'item_name'
            },{
                header : '套件号',
                dataIndex : 'set_code'
            },{
                header : '套件名称',
                dataIndex : 'set_name'
            },{
                id:'item_name',
                header : '单套数量',
                align : 'right' ,
                dataIndex : 'child_qty'
            },{
                id:'order_no',
                header : '订单号',
                dataIndex : 'order_number',
                editor : new Ext.Editor(new Rs.ext.form.Telescope({
                    singleSelect : true ,
                    progCode : 'ordDetailNew' ,
                    displayField : 'A.ORDER_NO' ,
                    valueField : 'A.ORDER_NO'
                }) , {
					listeners : {
                        complete : function(e,v,ov){
                            var selectRecord = this.field.selectedRecord ;
                            if(selectRecord){
                                //反填订单行号
                                this.record.set('order_seq_no',selectRecord.get('A.SEQ_NO')) ;
                            }
                        }
                    } ,
                    autoSize : true,
                    scope : this
				})
            },{
                id:'order_seq_no',
                header : '订单行号',
                dataIndex : 'order_seq_no',
                align : 'right' ,
                renderer : function(value){
                    if(value === 'undefined'){
                        return '';
                    } else{
                        return value;
                    }
                }
            },{
                id:'receive_qty',
                header : '*数量',
                align : 'right' ,
                dataIndex : 'receive_qty',
                editor : this.receiveQtyEditor = new Ext.form.NumberField({
                	listeners : {
                        change : function(file, newValue, oldValue){
                            var data = this.gridEditor.record.data ;
                                data['receive_amt'] = data['receive_price'] * newValue ;
                        }
                    } 
                }),
                summaryType: 'sum'
            },{
                id:'receive_price',
                header : '*单价',
                dataIndex : 'receive_price',
                align : 'right' ,
                editor : this.receivePriceEditor = new Ext.form.NumberField({
                    listeners : {
                        change : function(file, newValue, oldValue){
                        	var data = this.gridEditor.record.data ;
                                data['receive_amt'] = data['receive_qty'] * newValue ;
                        }
                    } 
                }),
                renderer : function(value){
                    if(value === 'undefined'){
                        return '';
                    } else{
                        return value;
                    }
                }
            },{
                id:'receive_amt',
                header : '金额',
                dataIndex : 'receive_amt',
                align : 'right' ,
                renderer : function(value){
                    if(value === 'undefined'){
                        return '';
                    } else{
                        return value;
                    }
                }
            },{
            	dataIndex : 'pm_unit' ,
                header : '计量单位'
            },{
                id:'assist_receive_qty',
                header : '辅助数量',
                dataIndex : 'assist_receive_qty',
                align : 'right' ,
                editor : new Ext.form.NumberField({}),
                renderer : function(value){
                    if(value === 'undefined'){
                        return '';
                    } else{
                        return value;
                    }
                }
            },{
                dataIndex : 'assist_unit' ,
                header : '辅助计量单位'
            } , {
                dataIndex : 'quality_flag' ,
                header : '质检' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '是' ,value : 'Y'} ,
                           {name : '否' ,value : 'N'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '是' ;
                   } else {
                       return '否' ;
                   }
                }
            } , {
                dataIndex : 'receive_type' ,
                header : '接收单类型' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : 'R-正常' ,value : 'R'} ,
                           {name : 'H-换料' ,value : 'H'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'R'){
                       return 'R-正常' ;
                   } else if(v == 'H'){
                       return 'H-换料' ;
                   } else {
                        return ''  ;
                   }
                }
            } , {
                dataIndex : 'ontime_flag' ,
                header : '准时' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '是' ,value : 'Y'} ,
                           {name : '否' ,value : 'N'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '是' ;
                   } else {
                       return '否' ;
                   }
                }
            },{
                dataIndex : 'tax_code' ,
                header : '税码' ,
                editor : new Ext.Editor(new Rs.ext.form.Telescope({
                    progCode : 'taxCode' ,
                    singleSelect : true ,
                    displayField : 'TAX_CODE' ,
                    valueField : 'TAX_CODE'
                }) , {
                    listeners : {
                        complete : function(e,v,ov){
                            if(this.field.selectedRecord){
                                //反填税码描述
                                this.record.set('tax_desc',this.field.selectedRecord.get('TAX_DESC')) ;
                                //反填税率
                                this.record.set('tax_rate',this.field.selectedRecord.get('TAX_RATE')) ;
                            }
                        }
                    } ,                
                	autoSize : true ,
                	scope : this
                }) 
            } , {
                dataIndex : 'tax_desc' ,
                header : '税码描述'
            } , {
                dataIndex : 'tax_rate' ,
                header : '税率%' ,
                align : 'right'
            } , {
                dataIndex : 'coop_flag' ,
                header : '外协' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '是' ,value : 'Y'} ,
                           {name : '否' ,value : 'N'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '是' ;
                   } else {
                       return '否' ;
                   }
                }
            } , {
                dataIndex : 'manufacturer_code' ,
                header : '生产单位编码' ,
                editor : new Ext.Editor(new Rs.ext.form.Telescope({
                    singleSelect : true ,
                	progCode : 'relVendor' ,
                	displayField : 'PARTNER_CODE' ,
                	valueField : 'PARTNER_CODE' ,
                	buildProgCondtion : function(progCondition){
                	   return " relation_type='M'  and company_code ='" + USERINFO.COMPANY_CODE
                	       + (Ext.isEmpty(progCondition, false)?"": " AND " + progCondition);
                	}
                }),{
                    listeners : {
                        complete : function(e , o ,ov){
                            if(this.field.selectedRecord){
                                this.record.set('manufacturer_name' , this.field.selectedRecord.get('PARTNER_NAME'));
                            }    
                        }
                    } ,
                    autoSize : true ,
                    scope : this
                }) 
            } ,{
                dataIndex : 'manufacturer_name' ,
                header : '生产单位名称'
            } ,{
                dataIndex : 'actual_days' ,
                header : '实际天数' ,
                align : 'right' ,
                editor : new Ext.form.NumberField({
                })
            } ,{
                dataIndex : 'customer_order_no' ,
                header : '销售订单号'
            }  ,{
                dataIndex : 'customer_name' ,
                header : '客户名称'
            } ,{
                dataIndex : 'receive_note' ,
                header : '说明' , 
                editor : true 
            } ,{
                dataIndex : 'warehouse_code' ,
                header : '仓库编码' ,
                editor : new Ext.Editor(new Rs.ext.form.Telescope({
                    progCode : 'pmWare' ,
                    singleSelect : true ,
                    valueField : 'WAREHOUSE_CODE' ,
                    displayField : 'WAREHOUSE_CODE' ,
                    buildprogCondtion : function(progCondtion){
                        return "company_code='" + USERINFO.COMPNAY_CODE + "'" + (Ext.isEmpty(progCondtion,flse) ? "" :
                                (" and " +  progCondtion)) ;
                    }
                }),{
                    listeners : {
                        complete : function(e , o , ov){
                            if(this.field.selectedRecord){
                                this.record.set('warehouse_name' , this.field.selectedRecord.get('WAREHOUSE_NAME'));
                            }
                        }
                    } , 
                    autoSize : true ,
                    scope : this
                })
            } ,{
                dataIndex : 'warehouse_name' ,
                align : 'left' ,
                width : 125 ,
                header : '仓库名称'
            } ,{
                dataIndex : 'quality_qty' ,
                align : 'right' ,
                width : 125 ,
                header : '合格数量',
                align : 'right'
            } ,{
                dataIndex : 'assist_quality_qty' ,
                align : 'right' ,
                width : 125 ,
                align : 'right' ,
                header : '辅助合格数量'
            } ,{
                dataIndex : 'stock_qty' ,
                align : 'right' ,
                width : 125 ,
                align : 'right' ,
                header : '入库数量'
            }]) ,
            bbar : new Rs.ext.grid.SliderPagingToolbar({
                    pageSize : 16,  //初始化显示的条数
                    hasSlider : true,//是否显示修改显示条数的滚动条
                    store : store,
                    displayInfo : true
                }) ,
                //插件加载有先后顺序
           plugins : [new Rs.ext.grid.EditorGridViewPlugin() , totalSummary]
        });

        rs.pm.DetailGrid.superclass.constructor.call(this, config);
        

        Rs.EventBus.on('documenthead-deleterecord', this.deleteRecord, this);
        
        
        this.addEvents('addHead');
        
        Rs.EventBus.register(this , 'detailgrid' , ['savedata']);
        
		this.seqNoEditor.on('complete' , this.seqNoInputComplete , this);
		
        /**
         * @listeners beforeedit 
         * 在点击单元格时候,根据逻辑判断该单元格是否能够编辑
         * @function
         */
        this.on('beforeedit' , function(e){
			var data = e.record.data ;
	        if(data['rowType'] && data['rowType'] == 'N' 
			     || (e.field != 'seq_no' && e.field != 'assist_receive_qty')){
	            return true ;
	        } else {
	            return false ;
	        }
        } ,this);
    },
    
    /**
     * @method createNewLine
     * 根据store,创建一条记录
     */
    createNewLine : function(){
		var grid = this ,
            ds = grid.getStore(),
            record = new ds.recordType() ,
            keys = ds.fields.keys;
			
        record.data = {};
        for (var i = 0,len = keys.length; i < len; i++) {
            record.data[keys[i]] = '';
        }
		//行类型: N 表示新增 
        record.data['rowType'] = 'N' ;
		
        this.stopEditing();
        record.dirty = false ;
        record.phantom = false ;
        ds.insert(ds.getCount(), record);
    } ,
    
	
	/**
     * @method seqNoInputComplete
     * @params editor 当前编辑器
     * @params newValue 当前编辑器的最新值
     * @params oldValue 当前编辑器的上一次保留值
     */
    seqNoInputComplete : function(editor, newValue , oldValue){
		if(newValue == ""){
			return ;
		}
		var modifyRecord = this.store.getModifiedRecords();
		for(var i=0,len=modifyRecord.length;i<len;i++){
			var record = modifyRecord[i] ;
			if(record['data']['seq_no'] == newValue){
				Ext.Msg.alert('提示' , '行号重复' , function(){
                       editor.record.set('seq_no' , '') ;
                } , this);
				return ;   
			}
		}
        Rs.Service.call({
            url : this.url ,
            method : 'checkRepeat' ,
            params : {
                seqNo : newValue ,
				receiveNo : this.head.rn.getValue() 
            }
        } , function(result){
                var grid = this ,
                    record = this.seqNoEditor.record ,
                    ds = grid.getStore();
                if(result.success == 'true'){
                   record.phantom = true ;
                   var count = ds.getCount() ;
                   this.createNewLine();
                   grid.startEditing(count-1 , 2);//将光标置于适当的位置
                } else {
                   Ext.Msg.alert('提示' , result.msg , function(){
                       record.set('seq_no' , '') ;
                       record.commit(); //将红色的修改单元格标记去掉
                   } , this);
                }
        } , this);
    } ,
	
	
    /**
     * @method doSave
     * 调用store的save方法,完成前端和后台数据的同步
     */
    doSave : function(receiveNo){
        this.store.save() ;
        this.store.on('save',function(){
           this.store.reload({
               params : {
                   receive_no : receiveNo
               }
           });
		   this.head.rn.setReadOnly(true);
        },this) ;
    } ,
    
    /**
     * @method setData
     * 打开该页面的时候,根据接收单号来load数据
     * @param {string} receive_no
     */
    setData : function(receive_no){
        var store = this.getStore();
        store.reload({
            params : {
                receive_no : receive_no
            }
        });
    },
    
    /**
     * @method resetData
     * 重置数据
     */
    resetData : function(){
        this.getStore().reload();
    } ,
    
    /**
     * @method deleteRecord
     * 删除记录
     * 1.获得选择的数据,根据选择的条数进行判断是否有数据需要删除
     * 2.如果有数据需要删除,则需要将提示用户是否需要删除数据
     */
    deleteRecord : function(){
        var selectsRecord = this.getSelectionModel().getSelections();
        if(!selectsRecord || selectsRecord.length<1){
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
                this.store.remove(selectsRecord);
                this.store.save() ;
                this.store.on('save',function(store,batch,data){
                    store.reload();
                },this);
            },
            scope : this,
            icon: Ext.MessageBox.QUESTION
        }) ;
    } ,
	
	/**
	 * @method checkMustInputField
	 * 检测必须输入的字段
	 */
	checkMustInputField : function(){
		var modifyRecord = this.store.getModifiedRecords();
		for(var i=0,len=modifyRecord.length;i<len;i++){
            var record = modifyRecord[i],
			    data = record.data ;
			if(data['seq_no'].toString().trim() == '' || data['item_style'].toString().trim() == '' ||
			   data['item_code'].toString().trim() == '' || data['receive_qty'].toString().trim() == '' ||
			   data['receive_price'].toString().trim() == ''){
			   	Ext.Msg.alert("提示", "带*的必须输入");
                return false;
			}
        }
        return true ; 
	} 
	
});