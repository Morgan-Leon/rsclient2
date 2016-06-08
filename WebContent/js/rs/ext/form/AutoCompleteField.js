Ext.ns('Rs.ext.form');
/**
 * @class Rs.ext.form.AutoCompleteField
 * @extends Ext.form.TextField
 * 
 * <pre>自动完成文本框(简易版望远镜和文本框的合体),不支持多选,默认是显示10条数据,没有翻页,通过用户输入信息,进行更加精确查询
 * 有两种模式:严格模式,类似望远镜的方式;模糊模式:类似建议文本框方式.模式是建议文本框
 * 两种模式的切换,请查看setStrictModel方法</pre>
 * 
 * @constructor
 * @param {Object} config The config object
 */
Rs.ext.form.AutoCompleteField = function(config){
	Rs.ext.form.AutoCompleteField.superclass.constructor.apply(this, arguments);
	
	this.addEvents(
		/**
		 * @event beforeexpand 展开之前触发该事件，如果监听的回调方法返回false,
		 * 则取消展开表格面板.
		 * @param {AutoCompleteField} this
		 */
		'beforeexpand',
		
		/**
		 * @event expand 展开表格面板之后触发该事件，
		 * @param {AutoCompleteField} this
		 */
		'expand', 
		
		/**
		 * @event collapse 合拢表格面板之后触发该事件
		 * @param {AutoCompleteField} this
		 */
		'collapse', 
		
		/**
		 * @event beforeselect 选择数据之前触发该事件
		 * @param {AutoCompleteField} this
		 * @param {Ext.data.Record} record 选择的记录
		 * @param {Ext.data.Store} store 数据源
		 */
		'beforeselect', 
		
		/**
		 * @event select 选择数据之后触发该事件
		 * @param {AutoCompleteField} this
		 * @param {Ext.data.Record} record 选择的记录
		 * @param {String} value 真实的值
		 * @param {String} display 显示的值
		 */
		'select',
		
		/**
		 * @event change 值发生变化的时候触发该事件
		 * @param {AutoCompleteField} this
		 * @param {String} value 新值
		 * @param {String} oldValue 老值
		 */
		'change',
		
		/**
		 * @event passed
		 * @param {AutoCompleteField} this
		 * @param {String} value 新值
		 * @param {Ext.data.Record} record 选择的记录
		 */
		'passed', 
		
		/**
		 * @event unpassed
		 * @param {AutoCompleteField} this
		 * @param {String} value 新值
		 * @param {String} valueField 显示字段
		 */
		'unpassed');
}

Ext.extend(Rs.ext.form.AutoCompleteField, Ext.form.TextField, {
	
	/**
	 * @cfg {Boolean} strictModel
	 * 精确数据模式,表示数据必须来源于数据库中
	 * 模糊数据模式,表示数据可以不必来源与数据库中
	 * 默认 false 表示模糊数据模式
	 */
	strictModel: false,
	
	/**
	 * @cfg {Number} queryDelay 
	 * 查询延迟时间,默认200毫秒
	 */
	queryDelay : 200,
	
	/**
	 * @cfg {String} displayField 
	 * 显示字段名称, 如果不配置该属性, 则将以表格第
	 * 二个字段为为显示字段,不存在第二个字段则以第一个字段为显示字段名称
	 */
	
	/**
	 * @cfg {String} valueField 
	 * 值字段名称, 如果不配置, 则将以表格第一个字段为值字段
	 */
	
	/**
	 * @cfg {Object} gridConfig 
	 * 配置望远镜表格显示的列,列宽;字段名一定大写
	 * 如:<pre><code> gridConfig: {
	 *	columns: [{
	 *		header: '人员编码',
	 *		dataIndex: 'ACCOUNT_ID',
	 *		width: 80
     *	},{
	 *		header: '所属部门',
	 *		dataIndex: 'DEPT_NAME',
	 *		width: 120
     *	}]
	 * }</pre></code>
	 */
	
	/**
	 * @cfg {String} progCondition 
	 * 望远镜默认条件
	 */
	
	/**
	 * @cfg {String} progCode 
	 * 望远镜编码
	 */
	
	/**
	 * @cfg {String} dataCompany 
	 * dblink公司号
	 */
	
	initComponent: function(){
		Rs.ext.form.AutoCompleteField.superclass.initComponent.call(this);
		
		//创建数据面板
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
    				this.infoLabel.setText('提示: 输入更多数据更精确');
    			} else {
    				this.infoLabel.setText('');
    			}
    		}, this);
		}
	},
	
	/**
	 * 创建表格面板
	 * @private
	 * @method initGeneralselPanel
	 * @param {Object} config
	 */
	initGeneralselPanel : function(config){
		var autoCompleteGridPanel = new Rs.ext.form.AutoCompleteGridPanel(config);
		return autoCompleteGridPanel;
	},
	
	
	
	/**
	 * 清除值
	 */
	clearValue : function() {
		delete this.lastValue;
		this.setRawValue('');
		delete this.selectedRecord;
		this.applyEmptyText();
	},

	
	/**
	 * 设置控件值
	 * @method setValue
	 * @param {String} value 值
	 */
	setValue : function(value) {
		delete this.selectedRecord;
		this.validateStrictData(value);
	},
	
	/**
	 * 获取控件值
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
    		if(this.strictModel){ //严格模式
    			return '';
    		}
    		return this.getRawValue();
    	}
	},
	
	/**
	 * 获取选中的记录
	 * @return {Record} record
	 */
	getValueRecord : function(){
		return this.selectedRecord;
	},
	
	/**
	 * 获取表格
	 * @method getGridPanel
	 * @return {Ext.grid.GridPanel} grid
	 */
	getGridPanel: function(){
		return this.autoCompleteGridPanel;
	},
	
	/**
	 * 设置严格/模糊模式 true: 严格  false: 模糊
	 * @method setStrictModel
	 * @param Boolean strictModel
	 */
	setStrictModel: function(strictModel){
		this.strictModel = strictModel;
		this.validateStrictData();
	},
	
	/**
	 * 获取strictModel
	 * @method getStrictModel
	 * @return {String} strictModel
	 */
	getStrictModel: function(){
		return this.strictModel;
	},
	
	/**
	 * 获取displayField
	 * @method getDisplayField
	 * @return {String} displayField
	 */
	getDisplayField: function(){
		return this.displayField;
	},
	
	/**
	 * 获取displayField
	 * @method getDisplayField
	 * @return {String} displayField
	 */
	getValueField: function(){
		return this.valueField;
	},
	
	/**
	 * 设置displayField
	 * @method getDisplayField
	 * @param {String} displayField
	 */
	setDisplayField: function(displayField){
		this.displayField = displayField ;
	},
	
	/**
	 * 设置valueField
	 * @method setValueField
	 * @param {String} valueField
	 */
	setValueField: function(valueField){
		this.valueField = valueField ;
	},
	
	/**
	 * 设置dataCompany
	 * @method setDataCompany
	 * @param {String} dataCompany
	 */
	setDataCompany: function(dataCompany){
		this.dataCompany = dataCompany;
		this.autoCompleteGridPanel.setDataCompany(dataCompany);
	},
	
	/**
	 * 获取dataCompany
	 * @method getDataCompany
	 * @return {String} dataCompany
	 */
	getDataCompany: function(){
		return this.dataCompany;
	},
	
	/**
	 * @method setProgCode
	 * @param {String} progCode 望远镜编码
	 * @param {String} progCondition 望远镜条件
	 * 动态修改编码以及查询条件
	 */
	setProgCode : function(progCode, progCondition){
        this.progCode = progCode ;  
        this.progCondition = progCondition ;
		this.autoCompleteGridPanel.setProgCode(progCode, progCondition);
	},
	
	/**
	 * 获取progCode
	 * @method getProgCode
	 * @return {String} progCode
	 */
	getProgCode: function(){
		return this.progCode;
	},
	
	/**
	 * 获取父节点的Z-index
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
	 * 获取当前节点的z-index
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
     * 光标离开前的检测数据
     * @private 
     * @method beforeBlur
     */
    beforeBlur: function(){
    	if(this.strictModel){
    		this.validateStrictData.defer(200, this);
    	}
    },
    
    /**
     * 数据验证
     * @method validateStrictData
     * @param {String/Null} value 要验证的值
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
						this.markInvalid('数据不匹配');
					}
				}
			}, this);
		} else if(value!==undefined && value.length == 0){
	        this.lastValue = value;
	        Rs.ext.form.AutoCompleteField.superclass.setValue.call(this,value);
	    } else {
	    	if(this.strictModel){
	    		this.fireEvent("unpassed", this, value, valueField);
	    		this.markInvalid('数据不匹配');
	    	}
		}
    },
    
    /**
     * 将光标focus到上一条数据
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
     * 将光标focus到下一条数据
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
     * 将光标focus到第一条数据
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
     * 将光标focus到最后一条数据
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
	 * 点击选中
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
	 * 查询数据
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
	 * 构建查询条件
	 * @method buildProgCondition
	 * @param {String} progCondition 默认的查询条件
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
     * 判断控件是否是展开的
     * @method isExpanded
     */
    isExpanded : function(){
        return this.listLayer && this.listLayer.isVisible();
    },
    
    /**
     * 展开数据列表
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
     * 合并数据列表
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
	//当 store 的元数据发生变化的时候修改表格的colModel
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
     * 查询数据
     * @params {String} progCondition 查询条件, 编写SQL查询条件
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
	 * @param {String} progCode 望远镜编码
	 * @param {String} progCondition 望远镜条件
	 * 动态修改望远镜编码以及查询条件
	 */
    setProgCode : function(progCode,progCondition){
        this.store.setProgCode(progCode,progCondition) ;
    },
    
    /**
	 * @method setDataCompany
	 * @param {String} dataCompany dblink公司号
	 * 动态dblink公司号
	 */
    setDataCompany: function(dataCompany){
    	this.store.setDataCompany(dataCompany) ;
    }
});