Ext.ns('Rs.ext.gird.plugin');

(function(){
	/**
	 * @class Rs.ext.gird.plugin.GridSaveRecordPlugin
	 * @extends Ext.util.Observable
	 * 表格保存插件
	 * 
	 * <pre>
                                  |- 失败 -> createfailure事件
          |- 只有新增 -> 执行新增 - |
          |                       |- 成功 -> createsuccess事件
          |
          |
          |
          |
          |
          |
  - 保存-  |                     |- 失败 -> modifyfailure事件 --> 执行modifyFailureMethod方法
  - 操作-  |- 只有修改 -> 执行修改 -|
          |                      |- 成功 -> modifysuccess事件 --> 执行modifySuccessMethod方法
          |
          |
          |
          |                                                                                                  |-是-执行新增操作    
          |                     |- 失败 -> modifyfailure事件 --> 执行modifyFailureMethod方法-选择是否继续执行新增-|
          |                     |                                                                            |-否-返回    
          |- 两者都有-> 执行修改 -|
                                |
                                |- 成功 -> modifysuccess事件 --> 执行modifySuccessMethod方法-执行新增操作                   
	 * 
	 * </pre>
	 * 
	 * 
	 */
	Rs.ext.gird.plugin.GridSaveRecordPlugin = function(config){
		Ext.apply(this, config);
		this.addEvents(
		/**
		 * @event beforemodify
		 * 修改之前
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'beforemodify', 
		
		/**
		 * @event modifyfailure
		 * 修改失败
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result 返回结果
		 * @param {Boolean} hasCreateRecord 是否有新增的记录
		 */
		'modifyfailure',
		
		/**
		 * @event modifysuccess
		 * 修改成功
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result 返回结果
		 * @param {Boolean} hasCreateRecord 是否有新增的记录
		 */
		'modifysuccess',
		
		/**
		 * @event beforecreate
		 * 新增之前
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'beforecreate', 
		
		/**
		 * @event createfailure
		 * 新增失败
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result 返回结果
		 */
		'createfailure',
		
		/**
		 * @event createsuccess
		 * 新增成功
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result 返回结果
		 */
		'createsuccess'
		);
		Rs.ext.gird.plugin.GridSaveRecordPlugin.superclass.constructor.apply(this , arguments);
	};
	
	Ext.extend(Rs.ext.gird.plugin.GridSaveRecordPlugin, Ext.util.Observable, {
		
		/**
		 * @cfg {Number} buttonPosition
		 * 新增按钮位置序号 默认 2
		 */
		buttonPosition : 2 ,
		
		/**
		 * @cfg {Object} rules
		 * 验证的必输字段规则
		 */
		rules : {} ,
		
		/**
		 * @cfg {Array} uniqueFields
		 * 验证数据唯一性的字段配置
		 */
		uniqueFields : [],
		
		/**
		 * @cfg {String} modifyMethod
		 * 修改操作调用的方法名 默认是update
		 */
		modifyMethod: 'update',
		
		/**
		 * @cfg {Function} modifySuccessMethod
		 * 修改成功后执行的方法,该方法在执行新增之前执行 如果该方法返回false 则不执行新增操作
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result 返回结果
		 * @param {Boolean} hasCreateRecord 是否有新增的记录
		 */
		modifySuccessMethod: Ext.emptyFn ,
		
		/**
		 * @cfg {Function} modifyFailureMethod
		 * 修改失败后执行的方法,该方法在执行新增方法之前执行,如果该方法返回false,则不执行新增操作
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result 返回结果
		 * @param {Boolean} hasCreateRecord 是否有新增的记录
		 */
		modifyFailureMethod: Ext.emptyFn ,
		
		/**
		 * @cfg {String/Array} modifyFields
		 * 在修改的数据之外,还需要提交到后台数据的字段名;
		 * 当不配置,则取store的idProperty
		 * 配置后,则取配置的字段,主键的值也会传递过去
		 * 默认取store的idProperty
		 */
		modifyFields: null,
		
		/**
		 * @cfg {String} createMethod
		 * 新增操作调用的方法名 默认是create
		 */
		createMethod: 'create',
		
		
		
		init: function(grid){
			this.grid = grid ;
			var self = this ;
			this.grid.store.on('load' , function(store, records, options){
				store.on('beforeload' , self.beforeLoadCheckData , self);
			} , this);
			
			var map = new Ext.KeyMap(Ext.getBody() , {
				key: [83],
	            ctrl:false,
	            alt : false,
	            shift:true,
			    fn: this.doSave.createDelegate(this.grid, [self], 0),
			    scope: this
			});
			this.initSaveButton();
		} ,
		
		//初始化保存按钮
		initSaveButton: function(){
			var tbar = this.grid.getTopToolbar();
			var self = this ;
			this.saveButton = new Ext.Button({
				text: '保存',
	            iconCls: 'rs-action-save',
				tooltip: "保存操作",
	            tooltipType: "qtip",
	            handler : this.doSave.createDelegate(this.grid, [self], 0),
	            scope: this
	        }) ;
			tbar.insertButton(2, [this.saveButton , '-']);
		} ,
	    
		//私有方法 保存记录
		//使用次方法时候，请现检查 doCheckMustInputField方法是否存在
	    doSave: function(self) {
	    	var rules = self.rules,
	    		uniqueFields = self.uniqueFields ;
	    	var store = this.getStore() ,
				modifyRecords = store.getModifiedRecords() ;
	        if (modifyRecords.length > 0) {
	        	var errorMsgs = self.doCheckMustInputField(rules , modifyRecords);
				if(!Ext.isEmpty(errorMsgs)){
					Ext.MessageBox.show({
		    			title: '错误',
		    			msg: errorMsgs.join('<br/>') ,
		    			buttons: Ext.MessageBox.OK,
		    			icon: Ext.MessageBox.ERROR
		    		});
		            return;
				}
				
				errorMsgs = self.validateLocalDataUnique(uniqueFields);
				
				if(!Ext.isEmpty(errorMsgs)){
					Ext.MessageBox.show({
		    			title: '错误',
		    			msg: errorMsgs.join('<br/>') ,
		    			buttons: Ext.MessageBox.OK,
		    			icon: Ext.MessageBox.ERROR
		    		});
		            return;
				}
				
				var datas = self.getModifyCreateRecord(store);
				var phantoms = datas[0], //新增数据
					modifyArray = datas[1];//修改数据
				
				if(!Ext.isEmpty(modifyArray)){//修改
					var callModifyFn = self.doModifyAction ;
					if(self.fireEvent('beforemodify', this, self, callModifyFn) !== false){
						self.doModifyAction(this, self);
					}
					return ;
				}
				
				if(!Ext.isEmpty(phantoms)){//新增
					var callCreateFn = self.doCreateAction;
					if(self.fireEvent('beforecreate', this, self, callCreateFn) !== false){
						self.doCreateAction(this, self);
					}
				}
			} else {
				Ext.MessageBox.show({
	    			title: '提示',
	    			msg: '数据没有发生变化,不需要保存',
	    			buttons: Ext.MessageBox.OK,
	    			icon: Ext.MessageBox.INFO
	    		});
			}
	    },
	    
	    /**
	     * 修改记录的操作
	     * @method doModifyAction
	     * @param {Ext.grid.GridPanel} grid
	     * @param {Rs.ext.gird.plugin.GridSaveRecordPlugin} plugin
	     */
	    doModifyAction: function(grid, self){
	    	var store = grid.getStore();
	    	var datas = self.getModifyCreateRecord(store);
			var phantoms = datas[0], //新增数据
				modifyArray = datas[1];//修改数据
			
			var data = [], modifyFields = self.modifyFields, modifyData = [];
			Ext.each(modifyArray, function(record, index, modifyArray){
				var param = {};
				if(Ext.isArray(modifyFields)){
					Ext.each(modifyFields, function(field, index, modifyFields){
						param[field] = record.get(field); 
					});
				} else if(!Ext.isEmpty(modifyFields)){
					param[modifyFields] = record.get(modifyFields);
				}
				
				param[store.writer.meta.idProperty] = record['id'] ;
				
				for(var p in record.modified){
					param[p] = record.get(p);
				}
				data.push(param);
			}, this);
			
			var params = {} ;
			
			Rs.apply(params, store.baseParams,{
				xaction: self.modifyMethod,
				data: data.concat(modifyData)
			});
			
			Rs.Service.call({
				url: store.url,
				method: self.modifyMethod,
				params: {
					params : params
				}
			}, function(result){
				var hasCreateRecord = !Ext.isEmpty(phantoms);
				if(result['success'] == false){
					if(self.fireEvent('modifyfailure', grid, self, result, hasCreateRecord) !== false){
						if(self.modifyFailureMethod.call(self, grid, self, result, hasCreateRecord) !== false){
							if(!Ext.isEmpty(phantoms)){
								var callBackFunction = function(buttonId , text , option){
									if(buttonId === 'ok'){
										self.removeModifyRecord(grid, result['data']);
										self.doCreateAction(grid, self);
									}
								};
								
								Ext.MessageBox.show({
									title: '提示',
									msg: '您修改数据保存出错,是否继续保存新增的数据?<br>选择【确定】则继续保存新增数据。<br/>选择【取消】则返回!',
									buttons: Ext.MessageBox.OKCANCEL,
									fn: callBackFunction,
									icon: Ext.MessageBox.QUESTION,
									scope : self
								});
							}
						}
					}
				} else {
					self.removeModifyRecord(grid, result['data']);
					if(self.fireEvent('modifysuccess', grid, self, result, hasCreateRecord) !== false){
						if(self.modifySuccessMethod.call(self, grid, self, result, hasCreateRecord) !== false){
							if(!Ext.isEmpty(phantoms)){
								self.doCreateAction(grid, self);
							}
						}
					};
				}
			}, this);
	    },
	    
	    /**
	     * 新增记录的操作
	     * @method doCreateAction
	     * @param {Ext.grid.GridPanel} grid
	     * @param {Rs.ext.gird.plugin.GridSaveRecordPlugin} plugin
	     */
	    doCreateAction: function(grid, self){
	    	var store = grid.getStore();
	    	var datas = self.getModifyCreateRecord(store);
			var phantoms = datas[0]; //新增数据
	    	
			var data = [] ;
			Ext.each(phantoms, function(record, index, phantoms){
				delete record.data['rowType'];
				data.push(record.data);
			}, this);
			
			var params = {} ;
			
			Rs.apply(params, store.baseParams,{
				xaction : self.createMethod,
				data : data
			});
			
			Rs.Service.call({
				url : store.url,
				method : self.createMethod,
				params : {
					params : params
				}
			}, function(result){
				if(result['success'] == false){
					self.fireEvent('createfailure', grid, self, result);
				} else {
					self.removeModifyRecord(grid, result['data']);
					self.fireEvent('createsuccess', grid, self, result);
				}
			}, this);
	    },
	    
	    /**
	     * 移除修改的数据
	     * private
	     * @method removeModifyRecord
	     * @param {Ext.grid.EditorGridPanel} grid
	     * @param {Array} datas
	     */
	    removeModifyRecord: function(grid, datas){
	    	var store = grid.getStore(), 
	    		idProperty = store.writer.meta.idProperty,
	    		modifyRecords = store.modified;
	    	
	    	Ext.each(datas, function(data, index, datas){
	    		var key = idProperty ;
	    		for(var i=0;i<modifyRecords.length;){
	    			var record = modifyRecords[i];
	    			if(record && record.get(key) == data[key]){
	    				store.modified.remove(record);
	    				break ;
	    			} else {
	    				i++;
	    			}
	    		}
	    	}, this);
	    },
	    
	    /**
	     * 获得修改和新增的数据
	     * private
	     * @method getModifyCreateRecord
	     * @param {Ext.data.Store} store
	     * @return {Array} result
	     */
	    getModifyCreateRecord: function(store){
	    	//								                新增数据                                 修改数据
			var rs = store.getModifiedRecords(), phantoms = [], modifyArray = [];
			
			if(rs.length){
				for(var i = rs.length-1; i >= 0; i--){
					var rec = rs[i];
					if(rec.phantom === true){//新增
						if(rec.isValid()){
							phantoms.push(rec);
						}
					} else if(rec.isValid()){//修改 
						modifyArray.push(rec);
					}
				}
			}
			return [phantoms, modifyArray]
	    },
	    
	    //检测必输字段 
	    //@params {Object} validateRules 验证规则
		//@params {Object} modifyRecords 修改的记录
		//@return {Array} errorsMsg 返回错误的信息
		doCheckMustInputField : function(validateRules , modifyRecords){
			var errorsMsg = [] ;
			var errorrows = {} ;
			Ext.each(modifyRecords , function(record, index, modifyRecords){
				data = record.data ;
				for(var field in validateRules){
					if(!data[field] || Ext.isEmpty(data[field].trim())){ //如果主键没有输入
						if(!errorrows[field]){
							errorrows[field] = [];
						}
						var row = this.grid.store.indexOf(record) + 1 ;
						errorrows[field].push(row) ;
					}
				}
			} ,this);
			
			for(var property in errorrows){
				if(!Ext.isEmpty(errorrows[property])){
					var message = "第" + errorrows[property].sort(function(v1, v2){
						if(v1 > v2){
							return 1;
						} else {
							return -1;
						}
					}).join('、') + "行" + validateRules[property]+ "不能为空" ;
					errorsMsg.push(message);
				}
			}
			return errorsMsg ;
		},
		
		//本地数据验证
		//@params {Array} validateFields 需要统一验证的字段
		//@return {Array} errors 返回错误的信息
	    validateLocalDataUnique : function(validateFields){
	    	var errorMsg = {} ,
	    		modifyRecords = [] ,
	    		store = this.grid.getStore() ,
	    		errors = [];
	    	var records = new Ext.util.MixedCollection() ;
	    	store.each(function(record , index , store){
	    		var joinKey = '' ;
	    		if(Ext.isArray(validateFields)){
	    			Ext.each(validateFields , function(field , index , validateFields){
	    				var data = record.get(field) ;
	    				joinKey +=  '?' + (Ext.isEmpty(data) ? '' : data) ;
	    			} , this);
	    			
	    			if(!Ext.isEmpty(joinKey) && records.containsKey(joinKey)){
	    				var msgs = errorMsg[joinKey] || [];
	    				if(Ext.isEmpty(msgs)){
	    					var row = records.get(joinKey) + 1;
	    					msgs.push(row);
	    				}
	    				msgs.push(index + 1);
	    				errorMsg[joinKey] = msgs ;
	    			} else {
	    				records.add(joinKey , index);
	    			}
	    		} else {
	    			Rs.error('您的验证规则validateFields配置错误，请检查！');
	    		}
	    	} , this);
	    	
	    	if(Ext.isEmpty(errorMsg)){
	    		return true ;
	    	} else {
	    		for(var p in errorMsg){
	    			var rows = errorMsg[p].sort(function(v1, v2){
						if(v1 > v2){
							return 1;
						} else {
							return -1;
						}
					});
	        		var msg = '第' + rows.join('、') + "行数据重复！" ;
	        		errors.push(msg);
	    		}
	    	}
	    	return errors;
	    },
	    
	    //在做load前,需要先判断用户是否在表格上是否有对数据修改,确认:先保存,后做操作;取消:不保存,做操作
	    //@params {Store} store 数据源
	    //@params {Event} e 事件对象
		beforeLoadCheckData : function(store, e){
			var modifyRecords = [] ;
	        modifyRecords = store.getModifiedRecords() ;
			if(modifyRecords.length > 0){
		        Ext.Msg.show({
		            title: '提示' ,
		            msg: '有数据发生变化,是否需要先保存?<br/>选择【确定】则执行先保存数据。<br/>选择【取消】则直接加载数据。',
		            buttons: Ext.Msg.OKCANCEL,
		            icon: Ext.MessageBox.QUESTION,
		            fn: function(btn, text) {
		            	store.un('beforeload' , this.beforeLoadCheckData , this);
		                if (btn == 'ok') {
		                	this.grid.loadMask.hide();
		                	this.doSave.createDelegate(this.grid, [this], 0)();
		                	store.on('beforeload' , this.beforeLoadCheckData , this);
		                } else {
		                	store.reload() ;
						}
		            },
		            scope: this
		        });
				return false ;
			} else {
				return true ;
			}
		}
	});
})();