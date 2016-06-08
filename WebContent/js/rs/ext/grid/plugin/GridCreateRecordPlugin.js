Ext.ns('Rs.ext.gird.plugin');
(function(){
	/**
	 * @class Rs.ext.gird.plugin.GridCreateRecordPlugin
	 * @extends Ext.util.Observable
	 * 表格新增插件
	 */
	Rs.ext.gird.plugin.GridCreateRecordPlugin = function(config){
		Ext.apply(this, config);
		this.addEvents(
		/**
		 * @event beforecreatenewline
		 * 将新增行新增到页面之前
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'beforecreatenewline', 
		
		/**
		 * @event aftercreatenewline
		 * 将新增行新增到页面之后
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'aftercreatenewline',
		
		/**
		 * @event validatenotpass
		 * 异步验证没有通过
		 * @param {Ext.data.Record} record 当前验证的记录行
		 * @param {Rs.ext.gird.plugin.GridValidatePlugin} plugin
		 * @param {Object} result 返回结果
		 */
		 'validatenotpass' ,
		 
		 /**
		 * @event validatepass
		 * 异步验证通过
		 * @param {Ext.data.Record} record 当前验证的记录行
		 * @param {Rs.ext.gird.plugin.GridValidatePlugin} plugin
		 * @param {Object} result 返回结果
		 */
		 'validatepass'
		);
		
		Rs.ext.gird.plugin.GridCreateRecordPlugin.superclass.constructor.apply(this , arguments);
	};
	
	Ext.extend(Rs.ext.gird.plugin.GridCreateRecordPlugin, Ext.util.Observable, {
		
		/**
		 * @cfg {Number} buttonPosition
		 * 新增按钮位置序号 默认 0
		 */
		buttonPosition : 0,
		
		/**
		 * @cfg {Object} createDefaultJson
		 * 新增记录的默认值 默认是空
		 */
		createDefaultJson : {},
		
		/**
		 * @cfg {Array} validateEditors
		 * 需要失去焦点时候,进行验证的编辑器,或者是需要验证的字段，字段不监听失去焦点事件
		 */
		validateEditors : [],
		
		/**
		 * @cfg {Object} params
		 * 除了配置的validateEditors的字段和编辑器传递到后台外,还将传递到后台的数据
		 */
		
		init: function(grid){
			this.grid = grid ;
			
			var self = this ;
			Ext.each(this.validateEditors, function(editor, index, validateEditors){
				if(editor.isFormField){
					editor.on({
						scope: this,
						change: this.validateRemoteDataUnique.createDelegate(this.grid, [self], true)
					});
				}
			}, this);
			
			var map = new Ext.KeyMap(Ext.getBody() , {
				key: [78],
	            ctrl:false,
	            alt : false,
	            shift:true,
			    fn: this.newAddLine ,
			    scope: this
			});
	
			this.initCreateButton();
		} ,
		
		//初始化按钮
		initCreateButton: function(){
			var tbar = this.grid.getTopToolbar();
			this.addButton = new Ext.Button({
	        	text: '新增',
	            iconCls: 'rs-action-create',
				tooltip: "新增操作",
	            tooltipType: "qtip",
	            handler : this.newAddLine,
	            scope: this
	        });
			tbar.insert(this.buttonPosition , this.addButton);
		},
		
		//新增行
	    newAddLine: function() {
	    	if(this.fireEvent('beforecreatenewline', this.grid, this) !== false){
	    		var json = {};
	    		Rs.apply(json , this.createDefaultJson); ;
		    	var grid = this.grid ;
				var store = grid.getStore(),
				    record = new store.recordType(json) ;
		        record.data['rowType'] = 'N' ; //行类型: N 表示新增 
		        grid.stopEditing() ;
		        var color = '#' + ((grid.addColor && grid.addColor.getValue()) || 'CAF9DB');
		        if(grid.position && grid.position.getValue()['inputValue'] === 1){
		        	store.insert(0, record)
		        	record.commit();
		        	grid.view.getRow(0).setAttribute("style" , 'background-color:' + color);
		        } else {
		        	store.insert(store.getCount(), record) ;
		        	record.commit();
		        	grid.view.getRow(store.getCount() - 1).setAttribute("style" , 'background-color:' + color);
		        }
		        this.fireEvent('aftercreatenewline', this.grid, this);
	    	}
	    },
	    
		// 远程数据验证 验证数据的唯一性
	    validateRemoteDataUnique : function(currentEditor, newValue, oldValue, self){
	    	var currentRowRecord = currentEditor.gridEditor.record ;
	    	if(!Ext.isEmpty(self.params) && !Ext.isObject(self.params)){
	    		throw Rs.error('params is not Object');
	    	}
	    	var params = self.params || {},isValid = true ;
	    	if(Ext.isArray(self.validateEditors)){
	    		Ext.each(self.validateEditors , function(editor , index, validateEditors){
	    			try {
	    				if(editor.isFormField){
	    					var currentColumn = this.getColumnModel().getColumnsBy(function(column, index){
	    						return column.editor === editor ;
	    					},this);
	    					var currentField = currentColumn[0]['dataIndex' || 'id'] ;
	    					if(editor === currentEditor){
	    						params[currentField] = newValue.trim();
	    					} else {
	    						var value = currentRowRecord.get(currentField) ;
	    						params[currentField] = value ? value.trim() : '' ;
	    					}
	    				} else {
	    					var value = currentRowRecord.get(editor) ;
    						params[editor] = value ? value.trim() : '';
	    				}
	    			} catch(e){
	    				isValid = false ;
	    				return ;
	    			}
	    		} , this);
	    	} else {
	    		Rs.error('您的异步验证规则validateEditors配置错误，请检查！');
	    	}
	    	
	    	if(!isValid){
	    		return ;
	    	}
	    	
			Rs.Service.call({
				url : this.store.url ,
				method : 'validate' ,
				params : {
					params : params
				}
			} , function(result){
				//验证不通过
				if(result.success !== 'true'){
					var callBackFunction = function(){
						self.fireEvent('validatenotpass' , currentRowRecord , this.grid, self, result);
					};
					Ext.MessageBox.show({
		    			title: '错误',
		    			msg: result.msg,
		    			fn : callBackFunction ,
		    			buttons: Ext.MessageBox.OK,
		    			icon: Ext.MessageBox.ERROR
		    		});
				} else {
					self.fireEvent('validatepass' , currentRowRecord , this.grid, self, result);
				}
			} , this);
	    }
	});
	
	Ext.reg('rs-ext-plugin-gridcreaterecordplugin', Rs.ext.gird.plugin.GridCreateRecordPlugin);
})();
