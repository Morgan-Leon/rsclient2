Ext.ns('Rs.ext.gird.plugin');
(function(){
	/**
	 * @class Rs.ext.gird.plugin.GridCreateRecordPlugin
	 * @extends Ext.util.Observable
	 * ����������
	 */
	Rs.ext.gird.plugin.GridCreateRecordPlugin = function(config){
		Ext.apply(this, config);
		this.addEvents(
		/**
		 * @event beforecreatenewline
		 * ��������������ҳ��֮ǰ
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'beforecreatenewline', 
		
		/**
		 * @event aftercreatenewline
		 * ��������������ҳ��֮��
		 * @param {Ext.grid.EditorGridPanel} grid
		 * @param {Rs.ext.gird.plugin.GridCreateRecordPlugin} plugin
		 */
		'aftercreatenewline',
		
		/**
		 * @event validatenotpass
		 * �첽��֤û��ͨ��
		 * @param {Ext.data.Record} record ��ǰ��֤�ļ�¼��
		 * @param {Rs.ext.gird.plugin.GridValidatePlugin} plugin
		 * @param {Object} result ���ؽ��
		 */
		 'validatenotpass' ,
		 
		 /**
		 * @event validatepass
		 * �첽��֤ͨ��
		 * @param {Ext.data.Record} record ��ǰ��֤�ļ�¼��
		 * @param {Rs.ext.gird.plugin.GridValidatePlugin} plugin
		 * @param {Object} result ���ؽ��
		 */
		 'validatepass'
		);
		
		Rs.ext.gird.plugin.GridCreateRecordPlugin.superclass.constructor.apply(this , arguments);
	};
	
	Ext.extend(Rs.ext.gird.plugin.GridCreateRecordPlugin, Ext.util.Observable, {
		
		/**
		 * @cfg {Number} buttonPosition
		 * ������ťλ����� Ĭ�� 0
		 */
		buttonPosition : 0,
		
		/**
		 * @cfg {Object} createDefaultJson
		 * ������¼��Ĭ��ֵ Ĭ���ǿ�
		 */
		createDefaultJson : {},
		
		/**
		 * @cfg {Array} validateEditors
		 * ��Ҫʧȥ����ʱ��,������֤�ı༭��,��������Ҫ��֤���ֶΣ��ֶβ�����ʧȥ�����¼�
		 */
		validateEditors : [],
		
		/**
		 * @cfg {Object} params
		 * �������õ�validateEditors���ֶκͱ༭�����ݵ���̨��,�������ݵ���̨������
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
		
		//��ʼ����ť
		initCreateButton: function(){
			var tbar = this.grid.getTopToolbar();
			this.addButton = new Ext.Button({
	        	text: '����',
	            iconCls: 'rs-action-create',
				tooltip: "��������",
	            tooltipType: "qtip",
	            handler : this.newAddLine,
	            scope: this
	        });
			tbar.insert(this.buttonPosition , this.addButton);
		},
		
		//������
	    newAddLine: function() {
	    	if(this.fireEvent('beforecreatenewline', this.grid, this) !== false){
	    		var json = {};
	    		Rs.apply(json , this.createDefaultJson); ;
		    	var grid = this.grid ;
				var store = grid.getStore(),
				    record = new store.recordType(json) ;
		        record.data['rowType'] = 'N' ; //������: N ��ʾ���� 
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
	    
		// Զ��������֤ ��֤���ݵ�Ψһ��
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
	    		Rs.error('�����첽��֤����validateEditors���ô������飡');
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
				//��֤��ͨ��
				if(result.success !== 'true'){
					var callBackFunction = function(){
						self.fireEvent('validatenotpass' , currentRowRecord , this.grid, self, result);
					};
					Ext.MessageBox.show({
		    			title: '����',
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
