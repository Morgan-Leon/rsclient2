Rs.define('rs.edm.BomDefineGridPanel',{
    extend : Ext.grid.EditorGridPanel ,
    mixins : [Rs.app.Main] ,
    constructor : function(config){
		this.treepanel = config.treepanel ;
		this.url = '/rsc/js/examples/demo/edm/bomdefinetree/BomDefineDataService.rsc' ;
        var store = new Rs.ext.data.Store({
            //autoLoad : true ,
            autoDestroy : true ,
            url : this.url ,
            idProperty : 'child_code' ,
            fields : ['child_code','child_name','mp_flag',{name: 'child_qty', type: 'float'},'scrap_rate','start_use_date','input_man_name','input_time',
                        'end_use_date', 'move_days','replace_flag','child_model',
						'child_norm', 'note1' ,'input_man_code','pick_flag','parent_code'] 
        });
		
		/**
		 * @listeners beforeload
		 * 先检测编码,如果编码不存在,则不加载数据
		 * @function
		 */
        store.on("beforeload" , function(){
            var code = Ext.getCmp('detail_item_code').text;
            if(code == undefined){
                return false ;            
            }
        } ,this) ;
        
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        });
        
        var tbar3 = new Ext.form.FormPanel({
        	autoWidth : true ,
            autoHight : true ,
            labelAlign: 'right',
        	layout: 'column',
            hideBorders : true ,
            items:[{
                    layout : 'form' ,
                    items : [this.itemCode = new Ext.form.Label({
                    	style : "position:relative;top:3px;" ,
                        xtype : 'label' ,
                        fieldLabel: '父项编码'
                    })]
                },{
                    layout : 'form' ,
                    items : [this.itemName = new Ext.form.Label({
                    	style : "position:relative;top:3px;" ,
                        xtype: 'label',
                        fieldLabel: '父项名称'
                    })]
                },{
                    layout : 'form' ,
                    items : [this.unitName = new Ext.form.Label({
                    	style : "position:relative;top:3px;" ,
                        xtype: 'label',
                        fieldLabel: '计量单位'
                    })]
                },{
                    layout : 'form' ,
                    items : [this.leadTime = new Ext.form.Label({
                    	style : "position:relative;top:3px;" ,
                        xtype: 'label',
                        fieldLabel: '提前期'
                    })]
                }]
        })  ;
        
		config = Rs.apply(config || {} ,{
			loadMask : true ,
			clicksToEdit : 1 ,
            store : store ,
            sm : sm ,
            colModel : new Ext.grid.ColumnModel([sm,{
                dataIndex : 'child_code' ,
                header : '*子项编码' ,
                width : 125 ,
                align : 'left' ,
                sortable : true ,
				editor : this.childCodeEditor = new Ext.Editor(new Rs.ext.form.Telescope({
		            progCode: 'itemCode',
		            singleSelect: true,
		            valueField: 'ITEM_CODE',
		            displayField: 'ITEM_CODE'
		        }), {
		            listeners: {
		                complete: {
							fn : function(e, v, ov) {
	                            if(v == ov){
	                                return ;
	                            }
	                            var selectrecord = e.field.selectedRecord;
	                            if (selectrecord) {
	                                e.record.set('child_name', selectrecord.get('ITEM_NAME'));
	                                e.record.set('unit_name', selectrecord.get('UNIT_NAME'));
	                                e.record.set('mp_flag', selectrecord.get('MP_FLAG'));
	                                e.record.set('child_model', selectrecord.get('ITEM_MODEL'));
	                                e.record.set('child_norm', selectrecord.get('ITEM_NORM'));
	                            }
	                            if(e.record.get('start_use_date').trim() != ""){
									this.checkKeyRepeat(e, v , e.record.get('start_use_date'));
	                            }
	                        } ,
							scope : this
						}
		            },
		            autoSize: true,
		            scope: this
		        })
            },{
                dataIndex : 'child_name' ,
                header : '子项名称' ,
                width : 125 ,
                align : 'left',
                sortable : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'unit_name' ,
                header : '计量单位' ,
                width : 125 ,
                align : 'left',
                sortable : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'dept_name' ,
                header : '责任部门' ,
                width : 125 ,
                align : 'left',
                sortable : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'mp_flag' ,
                header : 'M/P' ,
                width : 125 ,
                align : 'left',
                sortable : true
            },{
                dataIndex : 'pick_flag' ,
                header : '领料标记' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : new Ext.form.ComboBox({
                    triggerAction: 'all',
                    displayField: 'name' ,
                    valueField: 'value' ,
                    mode : 'local' , //使用本地数据
                    store : new Ext.data.JsonStore({
                        fields : ['name' , 'value'] ,
                        data : [
                            {name : '是' , value : 'Y'},                        
                            {name : '否' , value : 'N'}                     
                            ]
                    })
                }),
                renderer : function(v){
                    if('Y' == v){
                        return "是" ;
                    }else if ('N' == v){
                        return "否" ;
                    }else {
                        return "" ;
                    }
                }
            },{
                dataIndex : 'child_qty' , 
                header : '*标准消耗' ,
                width : 125 ,
                align : 'right',
                sortable : true ,
                editor : new Ext.form.NumberField({
                    allowBlank : false
                }) ,
				renderer: function(value){
                    return Ext.util.Format.number(value, '0.00');
                }
            },{
                dataIndex : 'scrap_rate' ,
                header : '废品率%' ,
                width : 125 ,
                align : 'right',
                sortable : true ,
                editor : new Ext.form.NumberField({
                    allowBlank : false ,
                    maxValue : 100 ,
                    minValue : 0 
                }) ,
                renderer : function(v){
                    return Ext.util.Format.number(v, '0.00') + '%';
                }
            },{
                dataIndex : 'start_use_date' ,
                header : '*启用日期' ,
                width : 125 ,
                align : 'center',
                sortable : true ,
                editor : new Ext.Editor(this.startUseDate = new Rs.ext.form.DateField({
                    allowBlank : false ,
                    format : 'Y/m/d'
                }), {
					listeners: {
                        complete : {
							fn :function(e, v, ov) {
								if(v == ov){
									return ;
								}
	                            this.endUseDate.setMinValue(v);
								if(e.record.get('child_code').trim() != ""){
									this.newAddLine();
								}                            
	                        } ,
		                    scope: this 
						}
                    },
                    autoSize: true,
                    scope: this
				})
            },{
                dataIndex : 'end_use_date' ,
                header : '*关闭日期' ,
                width : 125 ,
                align : 'center',
                sortable : true ,
                editor : new Ext.Editor(this.endUseDate = new Rs.ext.form.DateField({
                    allowBlank : false ,
                    format : 'Y/m/d'
                }), {
                    listeners: {
                        complete : {
                            fn :function(e, v, ov) {
                                this.startUseDate.setMaxValue(v);
                            } ,
                            scope: this
                        }
                    },
                    autoSize: true,
                    scope: this
                })
            },{
                dataIndex : 'move_days' , 
                header : '偏移' ,
                width : 125 ,
                align : 'right',
                sortable : true ,
                editor : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'replace_flag' ,
                header : '可替换' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : new Ext.form.ComboBox({
                    triggerAction: 'all',
                    displayField: 'name' ,
                    valueField: 'value' ,
                    mode : 'local' , //使用本地数据
                    store : new Ext.data.JsonStore({
                        fields : ['name' , 'value'] ,
                        data : [
                            {name : '是' , value : 'Y'},                        
                            {name : '否' , value : 'N'}                     
                            ]
                    })
                }),
                renderer : function(v){
                    if('Y' == v){
                        return "是" ;
                    }else if ('N' == v){
                        return "否" ;
                    }else {
                        return "" ;
                    }
                }
            },{
                dataIndex : 'child_model' ,
                header : '子项型号' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'child_norm' ,
                header : '子项规格' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'input_man_code' ,
                header : '录入人编码' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : true ,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'input_man_name' ,
                header : '录入人姓名' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'input_time' ,
                header : '录入时间' ,
                width : 125 ,
                align : 'center'
            },{
                dataIndex : 'note1' ,
                header : '备注' ,
                width : 125 ,
                align : 'left',
                sortable : true ,
                editor : true,
                renderer : function(v){
                    if(v == "undefined"){
                        return "" ;
                    }
                    return v ;
                }
            },{
                dataIndex : 'parent_code' ,
                header : '父项编码' ,
                width : 125 ,
                hidden : true ,
                align : 'left'
            }]) ,
            tbar : [{
                text : '删除' ,
                scope : this ,
                iconCls : 'rs-action-remove' ,
                handler : this.deleteRecord 
            },{
                text : '保存' ,
                scope : this ,
                iconCls : 'rs-action-save' ,
                handler : this.doSave
            }] ,
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16,//初始化显示的条数
                hasSlider: true,
                store: store,
                displayInfo: true,
                displayMsg: '共{2}条'
            }) ,
            
            listeners : {
                'render' : function() {  
                    tbar3.render(this.tbar);  
                }
            } ,
            plugins : [new Rs.ext.grid.EditorGridViewPlugin()]
        });
        rs.edm.BomDefineGridPanel.superclass.constructor.call(this,config);
        
        this.treepanel.on('click', this.onTreeClick, this);
        
		this.on('beforeedit' , this.checkEditor , this);
		this.store.on('exception',function(dataProxy,type,action,options,response,arg){  
		     Ext.MessageBox.alert('提示', response.message);  
		}) ;
    } ,
    
	/**
	 * @method onTreeClick 单击树节点
	 * @param {Object} node 点击的节点
	 * @param {Object} e
	 */
    onTreeClick : function(node, e){
    	var code = node['attributes']['code'] ;
		if(!code || code == ""){
			return ;
		}
        Rs.Service.call({
            url : this.url ,
            method : 'getParentInfo' ,
            params :{
                code : code         
            }
        },
        function(result){
            this.itemCode.setText(result['item_code']);	
            this.itemName.setText(result['item_name']);	
            this.unitName.setText(result['unit_name']);	
            this.leadTime.setText(result['lead_time']);	
            this.getStore().reload({
                params : {
                    code : code   
                }
            });
        }, 
        this);
    } ,
	
	/**
     * @method checkEditor
     * 检测新增行是否可以编辑
     * @params
     */
    checkEditor : function(e){
        var data = e.record.data ;
        if(data['rowType'] && data['rowType'] == 'N' || e.field != 'child_code'){
            return true ;
        } else {
            return false ;
        }
    } ,
	
	/**
     * @method newAddLine
     * 新增行
     */
    newAddLine: function() {
        var grid = this ,
            ds = grid.getStore(),
            record = new ds.recordType() ,
            keys = ds.fields.keys;
        record.data = {};
        for (var i = 0,len = keys.length; i < len; i++) {
            record.data[keys[i]] = '';
        }
        record.data['pick_flag'] = 'Y' ;
        record.data['child_qty'] = '1.00' ;
        record.data['scrap_rate'] = '0.00' ;
        record.data['start_use_date'] = '1900/01/01' ;
        record.data['end_use_date'] = '9999/12/31' ;
        record.data['move_days'] = '0' ;
        record.data['input_man_code'] = USERINFO.USERID ;
        record.data['input_man_name'] = USERINFO.USERNAME ;
        record.data['parent_code'] = Ext.getCmp('detail_item_code').text; ;
        //行类型: N 表示新增 
        record.data['rowType'] = 'N' ;
        grid.stopEditing();
        record.dirty = false;
        record.phantom = false;
        ds.insert(ds.getCount(), record);
    },
    /**
     * @method deleteRecord
     * 删除记录
     */
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
     * @method doSave
     * 保存操作
     */
    doSave : function(){
    	var modifyRecord = this.store.getModifiedRecords() ;
    	if(modifyRecord.length == 0 ){
    	   Ext.Msg.alert("提示","没有任何数据发生改变") ;
    	   return ;
    	}
        this.store.save() ;
        this.store.on('save',function(store,batch,data){
            store.reload();
			var node = this.treepanel.getSelectionModel().getSelectedNode() ;
			if(node && node.isLeaf()){
				node.parentNode.reload();
			}
			if(node && node.isExpanded()){
                node.reload() ;
			}
        },this);
    },
	
	/**
	 * 检测主键是否重复
	 * @param {Object} code 子项编码
	 * @param {Object} date 启用时间
	 */
	checkKeyRepeat : function(e , code , date){
        var modifyRecord = this.store.getModifiedRecords();
        for(var i=0,len=modifyRecord.length;i<len;i++){
            var record = modifyRecord[i] ;
            if(record['data']['child_code'] == code){
                Ext.Msg.alert('提示' , '主键重复' , function(){
                       e.record.set('child_code', '');
                       e.record.set('child_name', '');
                       e.record.set('unit_name', '');
                       e.record.set('mp_flag', '');
                       e.record.set('child_model', '');
                       e.record.set('child_norm', '');
					   e.record.commit(); //将红色的修改单元格标记去掉
                } , this);
                return ;   
            }
        }
		Rs.Service.call({
            url : this.url ,
            method : 'checkKeyRepeat' ,
            params : {
				parentCode : this.itemCode.text ,
                code : code
            }
        } , function(result){
                var grid = this ,
                    record = e.record ,
                    ds = grid.getStore();
                if(result.success == 'true'){
                   record.phantom = true ;
                   var count = ds.getCount() ;
                   this.newAddLine();
                   grid.startEditing(count-1 , 6);//将光标置于适当的位置
                } else {
                   Ext.Msg.alert('提示' , result.msg , function(){
                       record.set('child_code', '');
                       record.set('child_name', '');
                       record.set('unit_name', '');
                       record.set('mp_flag', '');
                       record.set('child_model', '');
                       record.set('child_norm', '');
                       record.commit(); //将红色的修改单元格标记去掉
                   } , this);
                }
        } , this);
	}
});