Ext.ns('Rs.ext.form');
/**
 * @class Rs.ext.form.AutoCompleteField
 * @extends Ext.form.TextField
 * 
 * <pre>�Զ�����ı���(���װ���Զ�����ı���ĺ���),��֧�ֶ�ѡ,Ĭ������ʾ10������,û�з�ҳ,ͨ���û�������Ϣ,���и��Ӿ�ȷ��ѯ
 * ������ģʽ:�ϸ�ģʽ,������Զ���ķ�ʽ;ģ��ģʽ:���ƽ����ı���ʽ.ģʽ�ǽ����ı���
 * ����ģʽ���л�,��鿴setStrictModel����</pre>
 * 
 * @constructor
 * @param {Object} config The config object
 */
Rs.ext.form.AutoCompleteField = function(config){
	Rs.ext.form.AutoCompleteField.superclass.constructor.apply(this, arguments);
	
	this.addEvents(
		/**
		 * @event beforeexpand չ��֮ǰ�������¼�����������Ļص���������false,
		 * ��ȡ��չ��������.
		 * @param {AutoCompleteField} this
		 */
		'beforeexpand',
		
		/**
		 * @event expand չ��������֮�󴥷����¼���
		 * @param {AutoCompleteField} this
		 */
		'expand', 
		
		/**
		 * @event collapse ��£������֮�󴥷����¼�
		 * @param {AutoCompleteField} this
		 */
		'collapse', 
		
		/**
		 * @event beforeselect ѡ������֮ǰ�������¼�
		 * @param {AutoCompleteField} this
		 * @param {Ext.data.Record} record ѡ��ļ�¼
		 * @param {Ext.data.Store} store ����Դ
		 */
		'beforeselect', 
		
		/**
		 * @event select ѡ������֮�󴥷����¼�
		 * @param {AutoCompleteField} this
		 * @param {Ext.data.Record} record ѡ��ļ�¼
		 * @param {String} value ��ʵ��ֵ
		 * @param {String} display ��ʾ��ֵ
		 */
		'select',
		
		/**
		 * @event change ֵ�����仯��ʱ�򴥷����¼�
		 * @param {AutoCompleteField} this
		 * @param {String} value ��ֵ
		 * @param {String} oldValue ��ֵ
		 */
		'change',
		
		/**
		 * @event passed
		 * @param {AutoCompleteField} this
		 * @param {String} value ��ֵ
		 * @param {Ext.data.Record} record ѡ��ļ�¼
		 */
		'passed', 
		
		/**
		 * @event unpassed
		 * @param {AutoCompleteField} this
		 * @param {String} value ��ֵ
		 * @param {String} valueField ��ʾ�ֶ�
		 */
		'unpassed');
}

Ext.extend(Rs.ext.form.AutoCompleteField, Ext.form.TextField, {
	
	/**
	 * @cfg {Boolean} strictModel
	 * ��ȷ����ģʽ,��ʾ���ݱ�����Դ�����ݿ���
	 * ģ������ģʽ,��ʾ���ݿ��Բ�����Դ�����ݿ���
	 * Ĭ�� false ��ʾģ������ģʽ
	 */
	strictModel: false,
	
	/**
	 * @cfg {Number} queryDelay 
	 * ��ѯ�ӳ�ʱ��,Ĭ��200����
	 */
	queryDelay : 200,
	
	/**
	 * @cfg {String} displayField 
	 * ��ʾ�ֶ�����, ��������ø�����, ���Ա���
	 * �����ֶ�ΪΪ��ʾ�ֶ�,�����ڵڶ����ֶ����Ե�һ���ֶ�Ϊ��ʾ�ֶ�����
	 */
	
	/**
	 * @cfg {String} valueField 
	 * ֵ�ֶ�����, ���������, ���Ա���һ���ֶ�Ϊֵ�ֶ�
	 */
	
	/**
	 * @cfg {Object} gridConfig 
	 * ������Զ�������ʾ����,�п�;�ֶ���һ����д
	 * ��:<pre><code> gridConfig: {
	 *	columns: [{
	 *		header: '��Ա����',
	 *		dataIndex: 'ACCOUNT_ID',
	 *		width: 80
     *	},{
	 *		header: '��������',
	 *		dataIndex: 'DEPT_NAME',
	 *		width: 120
     *	}]
	 * }</pre></code>
	 */
	
	/**
	 * @cfg {String} progCondition 
	 * ��Զ��Ĭ������
	 */
	
	/**
	 * @cfg {String} progCode 
	 * ��Զ������
	 */
	
	/**
	 * @cfg {String} dataCompany 
	 * dblink��˾��
	 */
	
	initComponent: function(){
		Rs.ext.form.AutoCompleteField.superclass.initComponent.call(this);
		
		//�����������
		this.autoCompleteGridPanel = this.initGeneralselPanel({
			autoScroll:false,
			height: 210,
			margins:5,
			bodyStyle:'border:0px;',
			progCode : this.progCode,
			dataCompany : this.dataCompany,
			gridConfig : this.gridConfig
		});
	},
	
	onRender: function(ct, position){
		Rs.ext.form.AutoCompleteField.superclass.onRender.call(this, ct, position);
		this.initListLayer();
	},
	
	initEvents: function(){
		Rs.ext.form.AutoCompleteField.superclass.initEvents.call(this);
		this.keyNav = new Ext.KeyNav(this.el, {
			'up': function(){
				if(this.isExpanded()){
					this.focusPrev();
	            }
			},
	        "down" : function(e){
	            if(!this.isExpanded()){
	                this.expand();
	            } else {
	            	this.focusNext();
	            }
	        },
	        "esc" : function(e){
	            if(this.isExpanded()){
	                this.collapse();
	            }
	        },
	        "enter" : function(e) {
                e.stopPropagation();
				var grid = this.autoCompleteGridPanel;
				if(this.isExpanded()){
					if(!grid.getStore().getCount()){
						this.collapse();
					}
					this.rowSelect(grid.getSelectionModel().getSelections());
				}
			},
			'home': function(e){
				if(this.isExpanded()) {
					this.focusFirst();
				}
			},
			'end': function(e){
				if(this.isExpanded()) {
					this.focusLast();
				}
			},
	        scope : this,
	        doRelay : function(e, h, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                    var relay = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                    if(!Ext.isIE && Ext.EventManager.useKeydown){
                        this.scope.fireKey(e);
                    }
                    return relay;
                }
                return true;
            },

            forceKeyDown : true,
            defaultEventAction: 'stopEvent'
	    });
		
		this.mon(this.el, 'keyup', this.filterQuery, this);
		this.on('specialkey', this.tabKeyCollapse, this);
		this.quikTask = new Ext.util.DelayedTask(this.quickAhead, this);
	},
	
	/**
	 * @private
	 * @method initListLayer
	 */
	initListLayer: function(){
		var layerParent = Ext.getDom(document['body'] || Ext.getBody());
		
    	this.listLayer = new Ext.Layer({
            parentEl: layerParent,
            shadow: this.shadow,
            cls : " x-combo-list ",
            style:'border:0px;',
            constrain:false,
            zindex: this.getZIndex(layerParent)
        });
    	
    	this.listLayer.setWidth(400);
    	
    	this.listLayer.alignTo(this.el, "tl-bl?");
    	if(this.syncFont !== false){
            this.listLayer.setStyle('font-size', this.el.getStyle('font-size'));
        }
    	
    	var panel = new Ext.Panel({
    		height: 225,
    		bodyStyle:'border:0px;',
    		bbar:new Ext.Toolbar({
    			style:'border:0px;',
    			items:[ this.infoLabel = new Ext.form.Label({
        			text: ''
        		})]
    		}),
    		items: [this.autoCompleteGridPanel]
    	});
    	panel.render(this.listLayer.dom);
    	
    	if(this.autoCompleteGridPanel){
    		this.autoCompleteGridPanel.on("rowclick", this.rowClick, this, {
				delay : 20,
				scope : this
			});
    		
    		this.autoCompleteGridPanel.getStore().on('load', function(store, records, options){
    			if(store.getTotalCount() > 10){
    				this.infoLabel.setText('��ʾ: ����������ݸ���ȷ');
    			} else {
    				this.infoLabel.setText('');
    			}
    		}, this);
		}
	},
	
	/**
	 * ����������
	 * @private
	 * @method initGeneralselPanel
	 * @param {Object} config
	 */
	initGeneralselPanel : function(config){
		var autoCompleteGridPanel = new Rs.ext.form.AutoCompleteGridPanel(config);
		return autoCompleteGridPanel;
	},
	
	
	
	/**
	 * ���ֵ
	 */
	clearValue : function() {
		delete this.lastValue;
		this.setRawValue('');
		delete this.selectedRecord;
		this.applyEmptyText();
	},

	
	/**
	 * ���ÿؼ�ֵ
	 * @method setValue
	 * @param {String} value ֵ
	 */
	setValue : function(value) {
		delete this.selectedRecord;
		this.validateStrictData(value);
	},
	
	/**
	 * ��ȡ�ؼ�ֵ
	 * @method getValue
	 * @return {String} value
	 */
	getValue : function() {
		if(this.selectedRecord){
    		var value = this.lastValue || '';
    		if (Ext.isEmpty(value)){
    			delete this.selectedRecord;
    		}
    		return value;
    	} else {
    		if(this.strictModel){ //�ϸ�ģʽ
    			return '';
    		}
    		return this.getRawValue();
    	}
	},
	
	/**
	 * ��ȡѡ�еļ�¼
	 * @return {Record} record
	 */
	getValueRecord : function(){
		return this.selectedRecord;
	},
	
	/**
	 * ��ȡ���
	 * @method getGridPanel
	 * @return {Ext.grid.GridPanel} grid
	 */
	getGridPanel: function(){
		return this.autoCompleteGridPanel;
	},
	
	/**
	 * �����ϸ�/ģ��ģʽ true: �ϸ�  false: ģ��
	 * @method setStrictModel
	 * @param Boolean strictModel
	 */
	setStrictModel: function(strictModel){
		this.strictModel = strictModel;
		this.validateStrictData();
	},
	
	/**
	 * ��ȡstrictModel
	 * @method getStrictModel
	 * @return {String} strictModel
	 */
	getStrictModel: function(){
		return this.strictModel;
	},
	
	/**
	 * ��ȡdisplayField
	 * @method getDisplayField
	 * @return {String} displayField
	 */
	getDisplayField: function(){
		return this.displayField;
	},
	
	/**
	 * ��ȡdisplayField
	 * @method getDisplayField
	 * @return {String} displayField
	 */
	getValueField: function(){
		return this.valueField;
	},
	
	/**
	 * ����displayField
	 * @method getDisplayField
	 * @param {String} displayField
	 */
	setDisplayField: function(displayField){
		this.displayField = displayField ;
	},
	
	/**
	 * ����valueField
	 * @method setValueField
	 * @param {String} valueField
	 */
	setValueField: function(valueField){
		this.valueField = valueField ;
	},
	
	/**
	 * ����dataCompany
	 * @method setDataCompany
	 * @param {String} dataCompany
	 */
	setDataCompany: function(dataCompany){
		this.dataCompany = dataCompany;
		this.autoCompleteGridPanel.setDataCompany(dataCompany);
	},
	
	/**
	 * ��ȡdataCompany
	 * @method getDataCompany
	 * @return {String} dataCompany
	 */
	getDataCompany: function(){
		return this.dataCompany;
	},
	
	/**
	 * @method setProgCode
	 * @param {String} progCode ��Զ������
	 * @param {String} progCondition ��Զ������
	 * ��̬�޸ı����Լ���ѯ����
	 */
	setProgCode : function(progCode, progCondition){
        this.progCode = progCode ;  
        this.progCondition = progCondition ;
		this.autoCompleteGridPanel.setProgCode(progCode, progCondition);
	},
	
	/**
	 * ��ȡprogCode
	 * @method getProgCode
	 * @return {String} progCode
	 */
	getProgCode: function(){
		return this.progCode;
	},
	
	/**
	 * ��ȡ���ڵ��Z-index
	 * @private
	 * @method getParentZIndex
	 */
	getParentZIndex : function(){
        var zindex;
        if (this.ownerCt){
            this.findParentBy(function(ct){
                zindex = parseInt(ct.getPositionEl().getStyle('z-index'), 10);
                return !!zindex;
            });
        }
        return zindex;
    },
    
	/**
	 * ��ȡ��ǰ�ڵ��z-index
	 * @private
	 * @method getZIndex
	 */
    getZIndex: function(layerParent){
    	var layerParent = layerParent || Ext.getDom(document.body || Ext.getBody());
        var zindex = parseInt(Ext.fly(layerParent).getStyle('z-index'), 10);
        if(!zindex){
            zindex = this.getParentZIndex();
        }
        return (zindex || 12000) + 5;
    },
    
    /**
     * ����뿪ǰ�ļ������
     * @private 
     * @method beforeBlur
     */
    beforeBlur: function(){
    	if(this.strictModel){
    		this.validateStrictData.defer(200, this);
    	}
    },
    
    /**
     * ������֤
     * @method validateStrictData
     * @param {String/Null} value Ҫ��֤��ֵ
     */
    validateStrictData: function(v){
    	var valueField = this.getValueField(),
			displayField = this.getDisplayField(),
			progCondition;
    	var value = v || this.getRawValue();
		if(!Ext.isEmpty(displayField, false) && !Ext.isEmpty(value, false)){
			this.lastValue = value ;
	        Rs.ext.form.AutoCompleteField.superclass.setValue.call(this,value);
			
			progCondition = displayField + ' = \'' + value + '\'';
			progCondition = this.buildProgCondition(progCondition);
			this.autoCompleteGridPanel.query(progCondition, function(store, records){
				var record = store.query(displayField, new RegExp("^" + value + "$")).get(0);
				if(record){
					this.el.dom.value = record.get(displayField);
					var oldValue = this.lastValue;
					this.lastValue = record.get(valueField);
					this.selectedRecord = record;
					this.fireEvent('change', this, this.lastValue, oldValue);
					if(this.strictModel){
						this.fireEvent("passed", this, record.get(valueField), record);
					}
					this.clearInvalid();
				}else {
					if(this.strictModel){
						this.fireEvent("unpassed", this, value, valueField);
						this.markInvalid('���ݲ�ƥ��');
					}
				}
			}, this);
		} else if(value!==undefined && value.length == 0){
	        this.lastValue = value;
	        Rs.ext.form.AutoCompleteField.superclass.setValue.call(this,value);
	    } else {
	    	if(this.strictModel){
	    		this.fireEvent("unpassed", this, value, valueField);
	    		this.markInvalid('���ݲ�ƥ��');
	    	}
		}
    },
    
    /**
     * �����focus����һ������
     * @private
     * @method focusPrev
     */
	focusPrev : function() {
		var grid = this.autoCompleteGridPanel,
			sm = grid.getSelectionModel();
		if(sm.hasSelection()) {
			sm.selectPrevious();
		} else {
			sm.selectFirstRow();
		}
		this.focus(false, 20);
	},

    /**
     * �����focus����һ������
     * @private
     * @method focusPrev
     */
	focusNext : function() {
		var grid = this.autoCompleteGridPanel,
			sm = grid.getSelectionModel();
		if(sm.hasSelection()) {
			sm.selectNext();
		} else {
			sm.selectFirstRow();
		}
		this.focus(false, 20);
	},
	
    /**
     * �����focus����һ������
     * @private
     * @method focusPrev
     */
	focusFirst : function() {
		var grid = this.autoCompleteGridPanel,
			store = grid.getStore(),	
			sm = grid.getSelectionModel();
		if(store.getCount() > 0){
			sm.selectFirstRow();
		}
		this.focus(false, 20);
	},

    /**
     * �����focus�����һ������
     * @private
     * @method focusPrev
     */
	focusLast : function() {
		var grid = this.autoCompleteGridPanel,
			store = grid.getStore(),	
			sm = grid.getSelectionModel();
		if(store.getCount() > 0){
			sm.selectLastRow();
		}
		this.focus(false, 20);
	},
    
	/**
	 * ���ѡ��
	 * @private
	 */
    rowClick: function(grid){
    	var sm;
		if(grid && (sm = grid.getSelectionModel())) {
			this.rowSelect(sm.getSelections());
			var s = grid.getStore(), desel = [];
			s.each(function(r){
				if(sm.isSelected(r) == false){
					desel.push(r);
				}
			}, this);
			this.rowDeSelect(desel);
		}
		this.focus(false, 20);
    },
    
    //private
	rowSelect : function(records) {
		this.onSelect();
	},
	
	//private
	rowDeSelect : function(records){
		
	},
    
    //private
	onSelect : function() {
		if(this.readOnly){
			this.collapse();
			return;
		}
		var grid = this.autoCompleteGridPanel,
			store = this.autoCompleteGridPanel.getStore(),
			sm = grid.getSelectionModel();
			record = sm.getSelected();
		if(record && this.fireEvent('beforeselect', this, record, store)) {
			var display = record.get(this.getDisplayField()),
				value = record.get(this.getValueField());
			
			this.el.dom.value = display;
			if(String(this.lastValue) != String(value)){
				this.fireEvent('change', this, value, this.lastValue);
			}
			this.lastValue = value;
			this.selectedRecord = record;
			this.collapse();
			this.fireEvent('select', this, record, value, display);
		}
	},
	
    /**
	 * ��ѯ����
	 * @private
	 */
	doQuery : function() {
		var displayField = this.getDisplayField(),
			valueField = this.getValueField(), value,
			progCondition;
		value = this.getRawValue();
		if(!Ext.isEmpty(displayField, false) && !Ext.isEmpty(value, false)){
			progCondition = displayField + ' like \'' + value + '%\'';
		}
		progCondition = this.buildProgCondition(progCondition);
		if(this.fireEvent('beforequery', this, progCondition) !== false){
			this.autoCompleteGridPanel.query(progCondition, function(store, records, options){
				this.fireEvent('query', this, records, progCondition);
			}, this);
		}
	},
	
	/**
	 * ������ѯ����
	 * @method buildProgCondition
	 * @param {String} progCondition Ĭ�ϵĲ�ѯ����
	 */
	buildProgCondition: function(progCondition){
		return progCondition;
	},
	
    
    //private
	filterQuery : function(e) {
        if(!e.isSpecialKey() || e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE){
            this.quikTask.delay(this.queryDelay);
            this.on("blur", this.clearQueryTask, this);
        }
    },
    
	//private
	clearQueryTask : function() {
		this.un("blur", this.clearQueryTask);
		this.quikTask.cancel();
	},

	//private
	quickAhead : function() {
		if(!this.isExpanded()){
			this.expand();
		}
		this.doQuery();
	},
	
	//private
	tabKeyCollapse : function(field, e){
		if(e && e.getKey() == e.TAB){
			this.collapse();
		}
	},
    
    /**
     * �жϿؼ��Ƿ���չ����
     * @method isExpanded
     */
    isExpanded : function(){
        return this.listLayer && this.listLayer.isVisible();
    },
    
    /**
     * չ�������б�
     * @method expand
     */
    expand: function(){
    	if(this.readOnly || this.disabled){
            return;
        }
        if(this.isExpanded()){
            return;
        }
        
        if(this.fireEvent('beforeexpand', this) !== false){
        	delete this.lastValue;
        	this.listLayer.alignTo(this.el, "tl-bl?");
        	this.listLayer.show();
        	this.mon(Ext.getDoc(), {
        		scope: this,
        		mousewheel: this.collapseIf,
        		mousedown: this.collapseIf
        	});
        	if(this.strictModel){
        		this.doQuery();
        	}
        	this.fireEvent('expand', this);
        }
    },
    
    /**
     * �ϲ������б�
     * @method collapse
     */
    collapse: function(){
    	if(!this.isExpanded()){
            return;
        }
    	this.listLayer.hide();
    	Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },
    
    // private
    collapseIf : function(e){
        if(!this.isDestroyed && !e.within(this.listLayer)){
            this.collapse();
        }
    }
});

Rs.ext.form.AutoCompleteGridPanel = function(config){
	config = config  || {};
    var progCode = config.progCode,
        dataCompany = config.dataCompany;
     
    var store = config.store || config.ds || new Rs.ext.data.GeneralselStore({
        autoLoad : true,
        autoDestroy: true,
        progCode : progCode,
        dataCompany: dataCompany
    });
    
    
    store.baseParams.metaData['limit'] = 10;
    
    var columns = config.columns || [];
	this.configColumns =  columns;
    delete config.columns;
     
    Ext.applyIf(config, {
    	border: 0,
        store : store,
        columns : columns,
        width: 400,
        height: 300,
        enableHdMenu : false,
        hideHeaders: true,
        viewConfig: {
        	scrollOffset:0,
        	forceFit: true
        },
        loadMask : true
    });
	Rs.ext.form.AutoCompleteGridPanel.superclass.constructor.call(this, config);
	//�� store ��Ԫ���ݷ����仯��ʱ���޸ı���colModel
	this.store.on('metachange', this.onStoreMeataChange, this);
}

Ext.extend(Rs.ext.form.AutoCompleteGridPanel, Ext.grid.GridPanel, {
	
    //private
    onStoreMeataChange : function(store, meta){
        var columns = [], fields = [], i, l, field ;
        if(fields = meta ? meta.fields : undefined){
            if(this.selModel != undefined
                && this.selModel instanceof Ext.grid.CheckboxSelectionModel){
                columns.push(this.selModel);
                if(this.rendered == true){
                    this.getSelectionModel().init(this);
                }
            }
            if(this.configColumns.length == 0){
                for(i = 0, l = fields.length; i < l; i++){
                    for(var k in fields){
                        var f = fields[k] ;
                        if(f['seqNo'] == i){
                            field = f ;
                            break ;
                        }
                    }
                    var c = {
                        dataIndex : field.name,
                        header : field.descCh || field.descEn || field.name,
                        width : field.width,
                        align : field.align,
                        hidden : field.hidden,
                        editable : false,
                        hideable : true,
                        sortable : true
                    } ;
                    columns.push(c);
                }
            } else {
                columns = Ext.combine(columns,this.configColumns) ;
            }
            var colModel = new Ext.grid.ColumnModel(columns);
            this.reconfigure(store, colModel);
        }
    },
    
    /**
     * ��ѯ����
     * @params {String} progCondition ��ѯ����, ��дSQL��ѯ����
     */
    query : function(progCondition, callback, scope){
        if(Ext.isFunction(callback)){
            this.store.on('load', function(store, records, options){
                callback.call(scope || this, store, records, options);
            }, this, {
                single : true
            });
        }
        if(!Ext.isEmpty(progCondition, false) 
            && Ext.isString(progCondition)){
            var params = {};
            Ext.apply(params, {
                progCondition : progCondition 
            });
            
            this.store.load({
                params : params 
            });
        }else {
            this.store.load();
        }
    },
    
    /**
	 * @method setProgCode
	 * @param {String} progCode ��Զ������
	 * @param {String} progCondition ��Զ������
	 * ��̬�޸���Զ�������Լ���ѯ����
	 */
    setProgCode : function(progCode,progCondition){
        this.store.setProgCode(progCode,progCondition) ;
    },
    
    /**
	 * @method setDataCompany
	 * @param {String} dataCompany dblink��˾��
	 * ��̬dblink��˾��
	 */
    setDataCompany: function(dataCompany){
    	this.store.setDataCompany(dataCompany) ;
    }
});