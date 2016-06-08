Ext.namespace('Rs.ext.grid');
(function(){
	Rs.ext.grid.PagingSelectPlugin = function(config){
		this.cfg = config ;
		Ext.apply(this, config);
		this.addEvents('submit');
	} ;
	
	Ext.extend(Rs.ext.grid.PagingSelectPlugin , Ext.util.Observable , {
		init : function(grid){
			this.grid = grid ;
		} ,
		initWindow : function(grid){
			var lstore = this.createStore(grid)  ;
			var lsm = this.createSelectModel(grid);
			var lcm = this.createColumnModel(grid , lsm);
			
			this.leftGrid = new Ext.grid.GridPanel({
				border : false ,
				hideBorders : true ,
				store: lstore ,
	            sm : lsm ,
	            stripeRows: true,//行颜色交替显式
	            colModel: lcm ,
	            clicksToEdit: 1 ,
	            bbar: new Rs.ext.grid.SliderPagingToolbar({
	                pageSize: 10 ,//初始化显示的条数
	                hasSlider: false,//是否显示修改显示条数的滚动条
	                store: lstore ,
	                displayInfo: false
	            })
			});
			
			var rstore = new Ext.data.JsonStore({
				fields : grid.store.fields.keys
			});
			
			var rsm = this.createSelectModel(grid);
			var rcm = this.createColumnModel(grid , rsm);
			this.rightGrid = new Ext.grid.GridPanel({
				border : false ,
				hideBorders : true ,
				store: rstore ,
				sm: rsm ,
	            stripeRows: true,//行颜色交替显式
	            colModel: rcm ,
	            clicksToEdit: 1
			});
			
			this.buttonPanel = new Ext.Panel({
				layout : 'vbox' ,
				layoutConfig : {
					align : 'center' ,
					pack : 'center'
				} ,
				defaults : {
					margins : '10 0 10 0'
				},
				frame : true ,
				border : false ,
				hideBorders : true ,
	            items : [new Ext.Button({
	                    tooltip : '添加',
	                    iconCls : 'rs-action-goright',
	                    handler : this.doAppend,
	                    scope : this
	                }), new Ext.Button({
	                    tooltip : '移除',
	                    iconCls : 'rs-action-goleft',
	                    handler : this.doRemove,
	                    scope : this
	                }), new Ext.Button({
	                    tooltip : '全部添加',
	                    iconCls : 'rs-action-bacthgoright',
	                    handler : this.doAppendAll,
	                    scope : this
	                }), new Ext.Button({
	                    tooltip : '全部移除',
	                    iconCls : 'rs-action-bacthgoleft',
	                    handler : this.doRemoveAll,
	                    scope : this
	                })
	            ]
	        });
			var winCfg = {
				layout : 'fit' ,
				closable : true ,
				modal : true ,
				resizable : true ,
				border : false ,
				hideBorders : true ,
				width : 800 ,
				height : 600 ,
				items : [{
					layout : 'column' ,
					items : [{
						columnWidth : .5 ,
						layout : 'fit' ,
						items : [this.leftGrid]
					} , {
						padding : 2 ,
						margins : 3 ,
						items : [this.buttonPanel]
					} , {
						columnWidth : .5 ,
						layout : 'fit' ,
						items : [this.rightGrid]
					}]
				}] ,
				buttonAlign : 'center' ,
				buttons : [{
					xtype : 'button' ,
					text : '确定' ,
					iconCls : 'rs-action-ok' ,
					handler : this.doSubmit ,
					scope : this
				} , {
					xtype : 'button' ,
					text : '取消' ,
					iconCls : 'rs-action-cancel' ,
					handler : this.doCancel ,
					scope : this
				}],
				listeners : {
					resize : this.doLayoutPanel ,
					scope : this
				}
			} ;
			
			Rs.apply(winCfg , this.cfg);
			this.win = new Ext.Window(winCfg) ;
		} ,
		
		doLayoutPanel :function(c){
			var height = c.getInnerHeight() - 2 ,
				width = c.getInnerWidth();
			this.leftGrid.setHeight(height);
			this.buttonPanel.setHeight(height);
			this.rightGrid.setHeight(height);
		} ,
		
		/**
		 * 构建数据源
		 */
		createStore : function(grid){
			var cfg = this.createStoreConfig(grid);
			return new Rs.ext.data.Store(cfg);
		} ,
		
		/**
		 * 构建数据源参数
		 */
		createStoreConfig : function(grid){
			var gs = grid.getStore() ,
				baseParams = Rs.apply(baseParams || {} , gs.baseParams) ;
				cfg = {
					autoLoad : true ,
					autoDestroy : true ,
					url : gs.url ,
					fields : gs.fields.keys ,
					baseParams : baseParams
				};
			if(gs.sortInfo){
				Rs.apply(cfg , {
					sortInfo : gs.sortInfo
				} );
			}
			
			if(gs.idProperty){
				Rs.apply(cfg , {
					idProperty : gs.idProperty
				} );
			}
			return cfg ;
		} ,
		
		/**
		 * 构建列模型
		 */
		createColumnModel : function(grid , sm){
			var cm = grid.getColumnModel();
			var colModel = [sm] ;
			Ext.each(cm.config , function(item , index , cfgs){
				if(!(item instanceof Ext.grid.AbstractSelectionModel || item instanceof Ext.grid.ActionColumn)){
					colModel.push(Rs.apply({} , item));
				}
			} , this);
			return new Ext.grid.ColumnModel(colModel) ;
		} ,
		
		/**
		 * 构建选择器
		 */
		createSelectModel : function(grid){
			var sm = grid.getSelectionModel() ;
			if(sm instanceof Ext.grid.CheckboxSelectionModel){
				sm = new Ext.grid.CheckboxSelectionModel();
			} else {
				sm = new Rs.ext.grid.CheckboxCellSelectionModel({});
			} ;
			return sm ;
		} ,
		
		/**
		 * 添加操作
		 */
		doAppend : function(){
			var sm = this.leftGrid.getSelectionModel() ,
				records = sm.getSelections() ,
				rs = this.rightGrid.getStore() ;
			var distinctRecords= [] ;
			Ext.each(records , function(record , index , records){
				if(rs.getRange().indexOf(record) == -1){
					distinctRecords.push(record);
				};
			}  ,this);
			if(!Ext.isEmpty(distinctRecords)){
				this.rightGrid.getStore().add(distinctRecords);
			}
		} , 
		
		/**
		 * 移除操作
		 */
		doRemove : function(){
			var records = this.rightGrid.getSelectionModel().getSelections() ;
			if(!Ext.isEmpty(records)){
				this.rightGrid.getStore().remove(records);
			}
		} ,
		
		/**
		 * 将源表格数据全部添加到目标表格中
		 */
		doAppendAll : function(){
			this.leftGrid.getSelectionModel().selectAll() ;
			this.doAppend();
		} , 
		
		/**
		 * 清空目标表格数据
		 */
		doRemoveAll : function(){
			this.rightGrid.getStore().removeAll() ;
		} ,
		
		/**
		 * 点击确定按钮
		 */
		doSubmit : function(){
			this.fireEvent('submit' , this.plugin , this.win ,this.rightGrid.getStore().getRange() , this);
		} ,
		
		/**
		 * 点击取消按钮
		 */
		doCancel : function(){
			this.win.close();
		} ,
		
		/**
		 * @method getLeftGrid 获得源表格对象
		 */
		getLeftGrid : function(){
			return this.leftGrid ;
		} ,
		
		/**
		 * @method getRightGrid 获得目标表格对象
		 */
		getRightGrid : function(){
			return this.rightGrid ;
		} ,
		
		/**
		 * @method getPluginWindow 获得插件窗口
		 */
		getPluginWindow : function(){
			this.initWindow(this.grid) ;
			return this.win ;
		}
		
	});
	
})();