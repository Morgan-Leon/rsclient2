Rs.define('rs.pm.DetailGrid', {
    
    extend : Ext.grid.EditorGridPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
    	
    	//������ͣ�¼�
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
		 * @listeners load ����load�¼�
		 * @function this.createNewLine() ����һ��
		 */ 
        store.on('load', function(){
         	this.createNewLine();
        },this);   
        
        var totalSummary = new Rs.ext.grid.HybridGridSummary();
        
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        	width: 24
        });
        
        config = Rs.apply(config || {}, {
        	title : '��ϸ���' ,
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
                header : '*�к�' ,
                sortable : true,
                align : 'right' ,
                editor : this.seqNoEditor = new Ext.Editor(new Ext.form.NumberField({
                }) , {
					autoSize : true
				})
            },{
				id : 'item_style' ,
            	dataIndex : 'item_style' ,
            	header : '*������' ,
            	editor : this.itemStyleEditor = {
            	   xtype : 'combo' ,
            	   mode : 'local' ,
            	   displayField : 'name' ,
            	   valueField : 'value' ,
            	   triggerAction : 'all' ,
            	   store : new Ext.data.JsonStore({
            	       fields : ['name','value'] ,
            	       data : [
            	           {name : '����' ,value : 'M'} ,
            	           {name : '����' ,value : 'F'} 
            	       ]
            	   })
            	} ,
            	renderer : function(v){
            	   if(v == 'M'){
            	       return '����' ;
            	   } else if(v == 'F') {
            	       return '����' ;
            	   } else {
            	       return '' ;
            	   }
            	} 
            },{
                dataIndex : 'free_flag' ,
                header : '���' ,
                editor : new Ext.Editor(new Ext.form.ComboBox({
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   value : 'N' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '��' ,value : 'Y'} ,
                           {name : '��' ,value : 'N'} 
                       ]
                   })
                }),{
                	autoSize : true
                }) ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '��' ;
                   } else {
                       return '��' ;
                   }
                }
            },{
                id : 'item_code' ,
                dataIndex : 'item_code' ,
                header : "*���ϱ���" ,
                align : 'left' ,
                width : 160 ,
                sortable : true,
                editor : this.itemCodeEditor = new  Ext.Editor(new  Rs.ext.form.Telescope({
                    progCode : 'itemPmNew2' ,
                    singleSelect : true ,//��ѡ��Զ��
                    valueField : 'A.ITEM_CODE' , //ע���д
                    displayField : 'A.ITEM_CODE' 
                }),{
                    listeners : {
                        complete : function(e,v,ov){
                        	var selectRecord = this.field.selectedRecord ;
                            if(selectRecord){
                            	//������������
                                this.record.set('item_name',selectRecord.get('A.ITEM_NAME')) ;
                                //���������λ
                                this.record.set('pm_unit',selectRecord.get('A.PM_UNIT')) ;
                                //�����������λ
                                this.record.set('assist_unit',selectRecord.get('A.ASSIST_UNIT')) ;
                                //����ֿ����
                                this.record.set('warehouse_code',selectRecord.get('A.WAREHOUSE_CODE')) ;
                            }
                        }
                    } ,
                    autoSize : true,
                    scope : this 
                })
            },{
                header : '��������',
                dataIndex : 'item_name'
            },{
                header : '�׼���',
                dataIndex : 'set_code'
            },{
                header : '�׼�����',
                dataIndex : 'set_name'
            },{
                id:'item_name',
                header : '��������',
                align : 'right' ,
                dataIndex : 'child_qty'
            },{
                id:'order_no',
                header : '������',
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
                                //������к�
                                this.record.set('order_seq_no',selectRecord.get('A.SEQ_NO')) ;
                            }
                        }
                    } ,
                    autoSize : true,
                    scope : this
				})
            },{
                id:'order_seq_no',
                header : '�����к�',
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
                header : '*����',
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
                header : '*����',
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
                header : '���',
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
                header : '������λ'
            },{
                id:'assist_receive_qty',
                header : '��������',
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
                header : '����������λ'
            } , {
                dataIndex : 'quality_flag' ,
                header : '�ʼ�' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '��' ,value : 'Y'} ,
                           {name : '��' ,value : 'N'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '��' ;
                   } else {
                       return '��' ;
                   }
                }
            } , {
                dataIndex : 'receive_type' ,
                header : '���յ�����' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : 'R-����' ,value : 'R'} ,
                           {name : 'H-����' ,value : 'H'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'R'){
                       return 'R-����' ;
                   } else if(v == 'H'){
                       return 'H-����' ;
                   } else {
                        return ''  ;
                   }
                }
            } , {
                dataIndex : 'ontime_flag' ,
                header : '׼ʱ' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '��' ,value : 'Y'} ,
                           {name : '��' ,value : 'N'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '��' ;
                   } else {
                       return '��' ;
                   }
                }
            },{
                dataIndex : 'tax_code' ,
                header : '˰��' ,
                editor : new Ext.Editor(new Rs.ext.form.Telescope({
                    progCode : 'taxCode' ,
                    singleSelect : true ,
                    displayField : 'TAX_CODE' ,
                    valueField : 'TAX_CODE'
                }) , {
                    listeners : {
                        complete : function(e,v,ov){
                            if(this.field.selectedRecord){
                                //����˰������
                                this.record.set('tax_desc',this.field.selectedRecord.get('TAX_DESC')) ;
                                //����˰��
                                this.record.set('tax_rate',this.field.selectedRecord.get('TAX_RATE')) ;
                            }
                        }
                    } ,                
                	autoSize : true ,
                	scope : this
                }) 
            } , {
                dataIndex : 'tax_desc' ,
                header : '˰������'
            } , {
                dataIndex : 'tax_rate' ,
                header : '˰��%' ,
                align : 'right'
            } , {
                dataIndex : 'coop_flag' ,
                header : '��Э' ,
                editor : {
                   xtype : 'combo' ,
                   mode : 'local' ,
                   displayField : 'name' ,
                   valueField : 'value' ,
                   triggerAction : 'all' ,
                   store : new Ext.data.JsonStore({
                       fields : ['name','value'] ,
                       data : [
                           {name : '��' ,value : 'Y'} ,
                           {name : '��' ,value : 'N'} 
                       ]
                   })
                } ,
                renderer : function(v){
                   if(v == 'Y'){
                       return '��' ;
                   } else {
                       return '��' ;
                   }
                }
            } , {
                dataIndex : 'manufacturer_code' ,
                header : '������λ����' ,
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
                header : '������λ����'
            } ,{
                dataIndex : 'actual_days' ,
                header : 'ʵ������' ,
                align : 'right' ,
                editor : new Ext.form.NumberField({
                })
            } ,{
                dataIndex : 'customer_order_no' ,
                header : '���۶�����'
            }  ,{
                dataIndex : 'customer_name' ,
                header : '�ͻ�����'
            } ,{
                dataIndex : 'receive_note' ,
                header : '˵��' , 
                editor : true 
            } ,{
                dataIndex : 'warehouse_code' ,
                header : '�ֿ����' ,
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
                header : '�ֿ�����'
            } ,{
                dataIndex : 'quality_qty' ,
                align : 'right' ,
                width : 125 ,
                header : '�ϸ�����',
                align : 'right'
            } ,{
                dataIndex : 'assist_quality_qty' ,
                align : 'right' ,
                width : 125 ,
                align : 'right' ,
                header : '�����ϸ�����'
            } ,{
                dataIndex : 'stock_qty' ,
                align : 'right' ,
                width : 125 ,
                align : 'right' ,
                header : '�������'
            }]) ,
            bbar : new Rs.ext.grid.SliderPagingToolbar({
                    pageSize : 16,  //��ʼ����ʾ������
                    hasSlider : true,//�Ƿ���ʾ�޸���ʾ�����Ĺ�����
                    store : store,
                    displayInfo : true
                }) ,
                //����������Ⱥ�˳��
           plugins : [new Rs.ext.grid.EditorGridViewPlugin() , totalSummary]
        });

        rs.pm.DetailGrid.superclass.constructor.call(this, config);
        

        Rs.EventBus.on('documenthead-deleterecord', this.deleteRecord, this);
        
        
        this.addEvents('addHead');
        
        Rs.EventBus.register(this , 'detailgrid' , ['savedata']);
        
		this.seqNoEditor.on('complete' , this.seqNoInputComplete , this);
		
        /**
         * @listeners beforeedit 
         * �ڵ����Ԫ��ʱ��,�����߼��жϸõ�Ԫ���Ƿ��ܹ��༭
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
     * ����store,����һ����¼
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
		//������: N ��ʾ���� 
        record.data['rowType'] = 'N' ;
		
        this.stopEditing();
        record.dirty = false ;
        record.phantom = false ;
        ds.insert(ds.getCount(), record);
    } ,
    
	
	/**
     * @method seqNoInputComplete
     * @params editor ��ǰ�༭��
     * @params newValue ��ǰ�༭��������ֵ
     * @params oldValue ��ǰ�༭������һ�α���ֵ
     */
    seqNoInputComplete : function(editor, newValue , oldValue){
		if(newValue == ""){
			return ;
		}
		var modifyRecord = this.store.getModifiedRecords();
		for(var i=0,len=modifyRecord.length;i<len;i++){
			var record = modifyRecord[i] ;
			if(record['data']['seq_no'] == newValue){
				Ext.Msg.alert('��ʾ' , '�к��ظ�' , function(){
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
                   grid.startEditing(count-1 , 2);//����������ʵ���λ��
                } else {
                   Ext.Msg.alert('��ʾ' , result.msg , function(){
                       record.set('seq_no' , '') ;
                       record.commit(); //����ɫ���޸ĵ�Ԫ����ȥ��
                   } , this);
                }
        } , this);
    } ,
	
	
    /**
     * @method doSave
     * ����store��save����,���ǰ�˺ͺ�̨���ݵ�ͬ��
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
     * �򿪸�ҳ���ʱ��,���ݽ��յ�����load����
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
     * ��������
     */
    resetData : function(){
        this.getStore().reload();
    } ,
    
    /**
     * @method deleteRecord
     * ɾ����¼
     * 1.���ѡ�������,����ѡ������������ж��Ƿ���������Ҫɾ��
     * 2.�����������Ҫɾ��,����Ҫ����ʾ�û��Ƿ���Ҫɾ������
     */
    deleteRecord : function(){
        var selectsRecord = this.getSelectionModel().getSelections();
        if(!selectsRecord || selectsRecord.length<1){
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
	 * ������������ֶ�
	 */
	checkMustInputField : function(){
		var modifyRecord = this.store.getModifiedRecords();
		for(var i=0,len=modifyRecord.length;i<len;i++){
            var record = modifyRecord[i],
			    data = record.data ;
			if(data['seq_no'].toString().trim() == '' || data['item_style'].toString().trim() == '' ||
			   data['item_code'].toString().trim() == '' || data['receive_qty'].toString().trim() == '' ||
			   data['receive_price'].toString().trim() == ''){
			   	Ext.Msg.alert("��ʾ", "��*�ı�������");
                return false;
			}
        }
        return true ; 
	} 
	
});