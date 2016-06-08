Rs.define('rs.inv.WarehouseDefinitionGrid', {
	
    extend: Ext.grid.EditorGridPanel,   //继承于EditorGridPanel
    
    constructor: function(config) {
		
    	Ext.QuickTips.init();  //开启提示
		
		var url = '../warehousedefine/WarehouseDefinitionGridDataService.rsc' ;
		
        var store = new Rs.ext.data.Store({ //数据源
            autoLoad: false , //自动加载
            autoDestroy: true , //自动销毁
            url: url , //请求地址
            idProperty: 'WAREHOUSE_CODE', //store主键
            fields: ['WAREHOUSE_CODE', 'WAREHOUSE_NAME', 'WAREHOUSE_ADDR', 'MP_FLAG',    //数据源字段列表
			         'MANAGEMENT_FLAG', 'TOTAL_QTY_FLAG', 'NEGATIVE_QTY_FLAG', 
					 'CHECK_BILL_FLAG', 'NOW_PERIOD', 'PURCHASE_DEPT_CODE', 
					 'PURCHASE_DEPT_NAME', 'MONTH_CLOSE_FLAG', 'SET_CODE', 
					 'SET_NAME', 'LTK_FLAG', 'NUM_OF_KIND', 'CHANGEOVER_DATE']
        });
		
		//仓库编码编辑器
		this.warehouseCodeEditor = new Ext.form.TextField({
			maxLength : 4 ,
			selectOnFocus : true //获得焦点时候，数据全选
        }) ;
		
		this.warehouseNameEditor = new Ext.form.TextField({
			maxLength : 20
		}) ;
		
		this.warehouseAddrEditor = new Ext.form.TextField({
			maxLength : 30
		}) ;
		
		//仓库类型编辑器
		this.mpFlagEditor =  new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            editable : false ,
            mode: 'local',//使用本地数据
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '采购件库',value: 'P'},
                       {name: '自制件库',value: 'M'}]
            })
        }) ;
		
		//管理方式编辑器
        this.managementFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            editable : false ,
            mode: 'local',//使用本地数据
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '按仓库管理',value: 'W'},
                       {name: '按货区管理',value: 'B'},
				       {name: '按货位管理',value: 'L'}]
            })
        }) ;
        
		//计划使用仓库编辑器
		this.totalQtyFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '是',value: 'Y'},{name: '否',value: 'N'}]
            })
        }) ;
		
		//允许负库存标记编辑器
		this.negativeQtyFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '允许',value: 'Y'},
                       {name: '不允许',value: 'N'}]
            })
        });
		
		//单据审核标记编辑器
		this.checkBillFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '是',value: 'Y'},
                       {name: '否',value: 'N'}]
            })
        }) ;
		
		//当前核算期编辑器
		this.nowPeriodEditor = new Rs.ext.form.PeriodField({
            format: 'Y/m'
        }) ;
		
		//采购部门名称编辑器
		this.purchaseDeptNameEditor = new Rs.ext.form.Telescope({
            progCode: 'deptCode',
            singleSelect: false ,
            //allowBlank : false ,
            valueField: 'DEPT_NAME',
            displayField: 'DEPT_NAME',
            listeners : {
            	select : function(telesope, record, value, display){
            		var a = this ;
            	}
            }
        }) ;
		
		//月结控制编辑器
		this.monthCloseFlagEditor = new Ext.form.ComboBox({
            mode: 'remote',
            triggerAction: 'all',
			editable : false,
			allowBlank : false,
			selectOnFocus : true ,
			editable : false ,
            displayField: 'typeDesc',
            valueField: 'typeCode',
            store: new Rs.ext.data.Store({
                url: '../warehousedefine/InvMonthCloseParam.rsc' ,
				autoLoad : true ,
                fields: ['typeCode', 'typeDesc']
            })
        }) ;
		
		//成套名称编辑器
		this.setNameEditor = new Rs.ext.form.Telescope({
            progCode: 'pmWare',
            valueField: 'WAREHOUSE_NAME',
            singleSelect: true,
            displayField: 'WAREHOUSE_NAME'
        })
		
		//立体库标记编辑器
		this.ltkFlagEditor = new Ext.form.ComboBox({
            triggerAction: 'all',
            displayField: 'name',
            valueField: 'value',
            mode: 'local',
            editable : false ,
            store: new Ext.data.JsonStore({
                fields: ['name', 'value'],
                data: [{name: '是',value: 'Y'},
                       {name: '否',value: 'N'}]
            })
        }) ;
		
		
		//仓库类型渲染器
		this.mpFlagRenderer = function(v) {
            if ('P' == v) {
                return "采购件库";
            } else if ('M' == v) {
                return "自制件库";
            } else {
                return "";
            }
        } ;
        
		//管理方式渲染器
		this.managementFlagRenderer = function(v) {
            if ('W' == v) {
                return "按仓库管理";
            } else if ('B' == v) {
                return "按货区管理";
            } else if ('L' == v) {
                return "按货位管理"
            } else {
                return '';
            }
        } ;
        
		//计划使用仓库渲染器
		this.totalQtyFlagRenderer = function(v) {
            if ('Y' == v) {
                return "<span style='color:red'>是</span>";
            } else if ('N' == v) {
                return "<span style='color:green'>否</span>";
            } else {
                return "";
            }
        } ;
		
		//允许负库存标记渲染器
		this.negativeQtyFlagRenderer = function(v) {
            if ('Y' == v) {
                return "<font color='red'>允许</font>";
            } else if ('N' == v) {
                return "<font color='green'>不允许</font>";
            } else {
                return "";
            }
        } ;
        
		//单据审核标记渲染器
		this.checkBillFlagRenderer = function(v) {
            if ('Y' == v) {
                return "是";
            } else if ('N' == v) {
                return "否";
            } else {
                return "";
            }
        } ;
        
		//月结控制渲染器
		this.monthCloseFlagRenderer = {
			fn : function(value) {
				var store = this.monthCloseFlagEditor.store ;
	            var idx = store.find(this.monthCloseFlagEditor.valueField, value);
	            var rec = store.getAt(idx);
	            return (rec == null ? value : rec.get(this.monthCloseFlagEditor.displayField) );
            } , 
			scope : this,
			delay: 200
		} ;
		
		//立体库标记渲染器
		this.ltkFlagRenderer = function(v) {
            if ('Y' == v) {
                return "是";
            } else if ('N' == v) {
                return "否";
            } else {
                return "";
            }
        } ;
        
        //选择器，此为带选择框的选择器
        var sm = new Rs.ext.grid.CheckboxCellSelectionModel({
        	moveEditorOnEnter: false
        });
		
        var columnModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer() , sm , {
            dataIndex: 'WAREHOUSE_CODE',
            header: "仓库编码",
            align: 'left',
            width: 160,
            sortable: true ,
			editor : this.warehouseCodeEditor
        },
        {
            dataIndex: 'WAREHOUSE_NAME',
            header: "仓库名称",
            align: 'left',
            width: 160,
            editor: this.warehouseNameEditor
        },
        {
            dataIndex: 'WAREHOUSE_ADDR',
            header: "仓库地址",
            align: 'left',
            width: 160,
            editor: this.warehouseAddrEditor
        },
        {
            dataIndex: 'MP_FLAG',
            header: "仓库类型",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.mpFlagEditor ,
            renderer: this.mpFlagRenderer
        },
        {
            dataIndex: 'MANAGEMENT_FLAG',
            header: "管理方式",
            align: 'left',
            width: 160,
            sortable: true,
            //下拉框
            editor: this.managementFlagEditor ,
            renderer: this.managementFlagRenderer
        },
        {
            dataIndex: 'TOTAL_QTY_FLAG',
            header: "计划使用仓库",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.totalQtyFlagEditor,
            renderer: this.totalQtyFlagRenderer
        },
        {
            dataIndex: 'NEGATIVE_QTY_FLAG',
            header: "允许负库存标记",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.negativeQtyFlagEditor ,
            renderer: this.negativeQtyFlagRenderer
        },
        {
            dataIndex: 'CHECK_BILL_FLAG',
            header: "单据审核标记",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.checkBillFlagEditor,
            renderer: this.checkBillFlagRenderer
        },
        {
            dataIndex: 'NOW_PERIOD',
            header: "当前核算期",
            align: 'center',
            width: 160,
            sortable: true,
            editor: this.nowPeriodEditor
        },
        {
            dataIndex: 'PURCHASE_DEPT_CODE',
            header: "采购部门编码",
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'PURCHASE_DEPT_NAME',
            header: "采购部门名称",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.purchaseDeptNameEditor 
        },
        {
            dataIndex: 'MONTH_CLOSE_FLAG',
            header: "月结控制",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.monthCloseFlagEditor,
            renderer: this.monthCloseFlagRenderer
        },
        {
            dataIndex: 'SET_CODE',
            header: "成套编码",
            align: 'left',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'SET_NAME',
            header: "成套名称",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.setNameEditor
        },
        {
            dataIndex: 'LTK_FLAG',
            header: "立体库标记",
            align: 'left',
            width: 160,
            sortable: true,
            editor: this.ltkFlagEditor ,
            renderer: this.ltkFlagRenderer
        },
        {
            dataIndex: 'CHANGEOVER_DATE',
            header: "最近结转日期",
            align: 'center',
            width: 160,
            sortable: true
        },
        {
            dataIndex: 'NUM_OF_KIND',
            header: "金额",
            align: 'right',
            width: 160,
            sortable: true
        }]);
		
		//保存用户偏好信息的插件
		var stateplugin = new Rs.ext.state.StatePlugin( { 
		     scheme : false
		});
		
		var tarConfig = [new Rs.ext.grid.ExportButton({
            grid: this ,
			tooltip: "导出CSV文件",
			text : '导出',
            tooltipType: "qtip" ,
            filename: "文件",
            paging: false
        }),'-',{
			text : '打印',
			iconCls: 'rs-action-printer' 
		}] ;
		
		this.doInitPlugin();
		
        Rs.apply(config || {}, {
            store: store,
            sm: sm,
            loadMask : true,
            stripeRows: true,//行颜色交替显式
            cm: columnModel,
            clicksToEdit: 2,
            stateful:true,
            stateId : 'inv1100-gridkl11220',
	        stateEvents: ['columnmove', 'columnresize','columnhiddenchange', 'sortchange', 'groupchange'],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize: 16 ,//初始化显示的条数
                hasSlider: true,//是否显示修改显示条数的滚动条
                store: store,
                displayInfo: true
            }) ,
            tbar: tarConfig,
			plugins: [this.createPlugin,
			          this.deletePlugin, this.savePlugin,
			          new Rs.ext.grid.EditorGridViewPlugin(),
			          stateplugin]
        });
        
        
        rs.inv.WarehouseDefinitionGrid.superclass.constructor.apply(this, arguments);
        
        this.doInitEvent();
    }  ,
    
    doInitEvent : function(){
    	
    	this.addEvents('columnhiddenchange');
        this.getColumnModel().on('hiddenchange' , function(columnModel,columnIndex, hidden){
        	this.fireEvent('columnhiddenchange' , columnModel,columnIndex, hidden);
	    },this);
        
		//编辑前判断,该单元格是否可以编辑
		this.on('beforeedit', 
				this.doBeforeEditCheck.createDelegate(this, [['WAREHOUSE_CODE','WAREHOUSE_NAME']], true), this);
    },
    
    doInitPlugin : function(){
    	this.createPlugin = new Rs.ext.gird.plugin.GridCreateRecordPlugin({
    		//validateEditors : [this.warehouseCodeEditor,'WAREHOUSE_NAME'], //验证主键唯一性的
    		validateEditors : [this.warehouseCodeEditor],
    		createDefaultJson : {
    			MP_FLAG: 'P' ,
    			MANAGEMENT_FLAG: 'W',
    			TOTAL_QTY_FLAG: 'Y',
    			NEGATIVE_QTY_FLAG: 'Y',
    			CHECK_BILL_FLAG: 'N',
    			MONTH_CLOSE_FLAG: 'N',
    			LTK_FLAG: 'N'
		  	},
		  	listeners : {
		  		aftercreatenewline : this.doFocusFirstEnableEditor, //新增行创建后
		  		validatenotpass: function(record, grid, plugin){//验证主键唯一性不能通过
					record.set('WAREHOUSE_CODE' , '') ;
					record.commit();
				},
		  		scope : this
		  	}
	  	});
    	
        this.deletePlugin = new Rs.ext.gird.plugin.GridDeleteRecordPlugin({
        	fields:'WAREHOUSE_CODE',
     	    listeners : {
     	    	//删除成功后
     	    	deletesuccess : function(grid , plugin){
     	    		grid.getStore().reload();
     	    	},
     	    	
     	    	deletefailure : function(grid , plugin){
     	    		grid.getStore().reload();
     	    	},
     	    	scope : this
     	    }
        });
        
    	//验证必输字段规则
		var rules = {
    		'WAREHOUSE_NAME' : '仓库名称',
    		'WAREHOUSE_ADDR' : '仓库地址'
    	};
		
        this.savePlugin = new Rs.ext.gird.plugin.GridSaveRecordPlugin({
        	//rules : rules,
     	    //uniqueFields : ['WAREHOUSE_CODE', 'WAREHOUSE_NAME'], //验证记录的唯一性
     	    modifyFields : ['WAREHOUSE_CODE'],
     	    listeners : {
     	    	//保存成功后
     	    	modifysuccess: function(grid , plugin, result, hasCreateRecord){
     	    		if(!hasCreateRecord){
     	    			grid.getStore().reload();
     	    		}
     	    	},
     	    	//新增成功后
     	    	createsuccess: function(grid , plugin, result, hasCreateRecord){
     	    		grid.getStore().reload();
     	    	},
     		    scope: this
     	    }
        });
    } ,
    
    /**
     * @private
     * @method doFocusFirstEnableEditor
     * 将光标置于第一个可编辑的列
     */
    doFocusFirstEnableEditor : function(){
    	var cm = this.getColumnModel() ;
    	var total = cm.getColumnCount();
    	var row = this.getStore().getCount() - 1 ;
    	for(var i=0;i<total;i++){
    		var result = cm.isCellEditable(i, row);
    		if(result){
    			this.startEditing(row , i);
    			break ;
    		}
    	}
    },
    
	/**
	 * @private
     * @method  检测字段是否可以编辑 , 该方法只需要关注fields数组，把不可编辑的字段dataIndex放在该数组即可
     * 如果是新增行,则可以编辑
	 * 如果是数据行,则主键不能编辑
     * @params e 事件对象
     * @params fields 存放不可编辑字段的dataIndex
     */
	doBeforeEditCheck : function(e , fields){
        var data = e.record.data ;
        //如果是新增行，则可以编辑
        if(data['rowType'] && data['rowType'] == 'N'){
            return true ;
        } else {//如果不是新增行
        	//如果点击的字段在是不可编辑的字段，则返回false
        	if(fields.indexOf(e.field) > -1 ){
        		return false ;
        	}
            return true ;
        }
    }
});