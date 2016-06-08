Ext.ns('Rs.ext.gird.plugin');

(function(){
	/**
	 * @class Rs.ext.gird.plugin.GridSaveRecordPlugin
	 * @extends Ext.util.Observable
	 * ��񱣴���
	 * 
	 * <pre>
                                  |- ʧ�� -> createfailure�¼�
          |- ֻ������ -> ִ������ - |
          |                       |- �ɹ� -> createsuccess�¼�
          |
          |
          |
          |
          |
          |
  - ����-  |                     |- ʧ�� -> modifyfailure�¼� --> ִ��modifyFailureMethod����
  - ����-  |- ֻ���޸� -> ִ���޸� -|
          |                      |- �ɹ� -> modifysuccess�¼� --> ִ��modifySuccessMethod����
          |
          |
          |
          |                                                                                                  |-��-ִ����������    
          |                     |- ʧ�� -> modifyfailure�¼� --> ִ��modifyFailureMethod����-ѡ���Ƿ����ִ������-|
          |                     |                                                                            |-��-����    
          |- ���߶���-> ִ���޸� -|
                                |
                                |- �ɹ� -> modifysuccess�¼� --> ִ��modifySuccessMethod����-ִ����������                   
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
		 * �޸�֮ǰ
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'beforemodify', 
		
		/**
		 * @event modifyfailure
		 * �޸�ʧ��
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result ���ؽ��
		 * @param {Boolean} hasCreateRecord �Ƿ��������ļ�¼
		 */
		'modifyfailure',
		
		/**
		 * @event modifysuccess
		 * �޸ĳɹ�
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result ���ؽ��
		 * @param {Boolean} hasCreateRecord �Ƿ��������ļ�¼
		 */
		'modifysuccess',
		
		/**
		 * @event beforecreate
		 * ����֮ǰ
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'beforecreate', 
		
		/**
		 * @event createfailure
		 * ����ʧ��
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result ���ؽ��
		 */
		'createfailure',
		
		/**
		 * @event createsuccess
		 * �����ɹ�
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result ���ؽ��
		 */
		'createsuccess'
		);
		Rs.ext.gird.plugin.GridSaveRecordPlugin.superclass.constructor.apply(this , arguments);
	};
	
	Ext.extend(Rs.ext.gird.plugin.GridSaveRecordPlugin, Ext.util.Observable, {
		
		/**
		 * @cfg {Number} buttonPosition
		 * ������ťλ����� Ĭ�� 2
		 */
		buttonPosition : 2 ,
		
		/**
		 * @cfg {Object} rules
		 * ��֤�ı����ֶι���
		 */
		rules : {} ,
		
		/**
		 * @cfg {Array} uniqueFields
		 * ��֤����Ψһ�Ե��ֶ�����
		 */
		uniqueFields : [],
		
		/**
		 * @cfg {String} modifyMethod
		 * �޸Ĳ������õķ����� Ĭ����update
		 */
		modifyMethod: 'update',
		
		/**
		 * @cfg {Function} modifySuccessMethod
		 * �޸ĳɹ���ִ�еķ���,�÷�����ִ������֮ǰִ�� ����÷�������false ��ִ����������
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result ���ؽ��
		 * @param {Boolean} hasCreateRecord �Ƿ��������ļ�¼
		 */
		modifySuccessMethod: Ext.emptyFn ,
		
		/**
		 * @cfg {Function} modifyFailureMethod
		 * �޸�ʧ�ܺ�ִ�еķ���,�÷�����ִ����������֮ǰִ��,����÷�������false,��ִ����������
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 * @param {Object} result ���ؽ��
		 * @param {Boolean} hasCreateRecord �Ƿ��������ļ�¼
		 */
		modifyFailureMethod: Ext.emptyFn ,
		
		/**
		 * @cfg {String/Array} modifyFields
		 * ���޸ĵ�����֮��,����Ҫ�ύ����̨���ݵ��ֶ���;
		 * ��������,��ȡstore��idProperty
		 * ���ú�,��ȡ���õ��ֶ�,������ֵҲ�ᴫ�ݹ�ȥ
		 * Ĭ��ȡstore��idProperty
		 */
		modifyFields: null,
		
		/**
		 * @cfg {String} createMethod
		 * �����������õķ����� Ĭ����create
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
		
		//��ʼ�����水ť
		initSaveButton: function(){
			var tbar = this.grid.getTopToolbar();
			var self = this ;
			this.saveButton = new Ext.Button({
				text: '����',
	            iconCls: 'rs-action-save',
				tooltip: "�������",
	            tooltipType: "qtip",
	            handler : this.doSave.createDelegate(this.grid, [self], 0),
	            scope: this
	        }) ;
			tbar.insertButton(2, [this.saveButton , '-']);
		} ,
	    
		//˽�з��� �����¼
		//ʹ�ôη���ʱ�����ּ�� doCheckMustInputField�����Ƿ����
	    doSave: function(self) {
	    	var rules = self.rules,
	    		uniqueFields = self.uniqueFields ;
	    	var store = this.getStore() ,
				modifyRecords = store.getModifiedRecords() ;
	        if (modifyRecords.length > 0) {
	        	var errorMsgs = self.doCheckMustInputField(rules , modifyRecords);
				if(!Ext.isEmpty(errorMsgs)){
					Ext.MessageBox.show({
		    			title: '����',
		    			msg: errorMsgs.join('<br/>') ,
		    			buttons: Ext.MessageBox.OK,
		    			icon: Ext.MessageBox.ERROR
		    		});
		            return;
				}
				
				errorMsgs = self.validateLocalDataUnique(uniqueFields);
				
				if(!Ext.isEmpty(errorMsgs)){
					Ext.MessageBox.show({
		    			title: '����',
		    			msg: errorMsgs.join('<br/>') ,
		    			buttons: Ext.MessageBox.OK,
		    			icon: Ext.MessageBox.ERROR
		    		});
		            return;
				}
				
				var datas = self.getModifyCreateRecord(store);
				var phantoms = datas[0], //��������
					modifyArray = datas[1];//�޸�����
				
				if(!Ext.isEmpty(modifyArray)){//�޸�
					var callModifyFn = self.doModifyAction ;
					if(self.fireEvent('beforemodify', this, self, callModifyFn) !== false){
						self.doModifyAction(this, self);
					}
					return ;
				}
				
				if(!Ext.isEmpty(phantoms)){//����
					var callCreateFn = self.doCreateAction;
					if(self.fireEvent('beforecreate', this, self, callCreateFn) !== false){
						self.doCreateAction(this, self);
					}
				}
			} else {
				Ext.MessageBox.show({
	    			title: '��ʾ',
	    			msg: '����û�з����仯,����Ҫ����',
	    			buttons: Ext.MessageBox.OK,
	    			icon: Ext.MessageBox.INFO
	    		});
			}
	    },
	    
	    /**
	     * �޸ļ�¼�Ĳ���
	     * @method doModifyAction
	     * @param {Ext.grid.GridPanel} grid
	     * @param {Rs.ext.gird.plugin.GridSaveRecordPlugin} plugin
	     */
	    doModifyAction: function(grid, self){
	    	var store = grid.getStore();
	    	var datas = self.getModifyCreateRecord(store);
			var phantoms = datas[0], //��������
				modifyArray = datas[1];//�޸�����
			
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
									title: '��ʾ',
									msg: '���޸����ݱ������,�Ƿ������������������?<br>ѡ��ȷ��������������������ݡ�<br/>ѡ��ȡ�����򷵻�!',
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
	     * ������¼�Ĳ���
	     * @method doCreateAction
	     * @param {Ext.grid.GridPanel} grid
	     * @param {Rs.ext.gird.plugin.GridSaveRecordPlugin} plugin
	     */
	    doCreateAction: function(grid, self){
	    	var store = grid.getStore();
	    	var datas = self.getModifyCreateRecord(store);
			var phantoms = datas[0]; //��������
	    	
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
	     * �Ƴ��޸ĵ�����
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
	     * ����޸ĺ�����������
	     * private
	     * @method getModifyCreateRecord
	     * @param {Ext.data.Store} store
	     * @return {Array} result
	     */
	    getModifyCreateRecord: function(store){
	    	//								                ��������                                 �޸�����
			var rs = store.getModifiedRecords(), phantoms = [], modifyArray = [];
			
			if(rs.length){
				for(var i = rs.length-1; i >= 0; i--){
					var rec = rs[i];
					if(rec.phantom === true){//����
						if(rec.isValid()){
							phantoms.push(rec);
						}
					} else if(rec.isValid()){//�޸� 
						modifyArray.push(rec);
					}
				}
			}
			return [phantoms, modifyArray]
	    },
	    
	    //�������ֶ� 
	    //@params {Object} validateRules ��֤����
		//@params {Object} modifyRecords �޸ĵļ�¼
		//@return {Array} errorsMsg ���ش������Ϣ
		doCheckMustInputField : function(validateRules , modifyRecords){
			var errorsMsg = [] ;
			var errorrows = {} ;
			Ext.each(modifyRecords , function(record, index, modifyRecords){
				data = record.data ;
				for(var field in validateRules){
					if(!data[field] || Ext.isEmpty(data[field].trim())){ //�������û������
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
					var message = "��" + errorrows[property].sort(function(v1, v2){
						if(v1 > v2){
							return 1;
						} else {
							return -1;
						}
					}).join('��') + "��" + validateRules[property]+ "����Ϊ��" ;
					errorsMsg.push(message);
				}
			}
			return errorsMsg ;
		},
		
		//����������֤
		//@params {Array} validateFields ��Ҫͳһ��֤���ֶ�
		//@return {Array} errors ���ش������Ϣ
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
	    			Rs.error('������֤����validateFields���ô������飡');
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
	        		var msg = '��' + rows.join('��') + "�������ظ���" ;
	        		errors.push(msg);
	    		}
	    	}
	    	return errors;
	    },
	    
	    //����loadǰ,��Ҫ���ж��û��Ƿ��ڱ�����Ƿ��ж������޸�,ȷ��:�ȱ���,��������;ȡ��:������,������
	    //@params {Store} store ����Դ
	    //@params {Event} e �¼�����
		beforeLoadCheckData : function(store, e){
			var modifyRecords = [] ;
	        modifyRecords = store.getModifiedRecords() ;
			if(modifyRecords.length > 0){
		        Ext.Msg.show({
		            title: '��ʾ' ,
		            msg: '�����ݷ����仯,�Ƿ���Ҫ�ȱ���?<br/>ѡ��ȷ������ִ���ȱ������ݡ�<br/>ѡ��ȡ������ֱ�Ӽ������ݡ�',
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