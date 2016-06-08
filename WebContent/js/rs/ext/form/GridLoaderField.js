Ext.ns("Rs.ext.form");

(function() {
	
	/**
	 * @class Rs.ext.form.GridLoaderField  
	 * 望远镜控件
	 * @extends Ext.form.TriggerField
	 * @constructor {Object} config
	 */
	Rs.ext.form.GridLoaderField = function(config) {
		config = config || {};
		var progCode = config.progCode,
			progCondition = config.progCondition ,
			queryPanelConfig = config.queryPanelConfig,
			gridConfig = config.gridConfig,
			buildProgCondtion = config.buildProgCondtion,
			dataCompany = config.dataCompany;
		
		this.columns = config.columns || [];
		delete config.columns;
		
		Rs.ext.form.GridLoaderField.superclass.constructor.call(this, Ext.apply(config, {
			enableKeyEvents : true,
			validationEvent : 'blur'
		}));
		
		//创建查询面板
		this.generalselPanel = this.initGeneralselPanel({
			progCode : progCode,
			dataCompany : dataCompany,
			progCondition : progCondition ,
			queryPanelConfig : queryPanelConfig ,
			gridConfig : gridConfig ,
			buildProgCondtion : buildProgCondtion 
		});
		
		this.addEvents(
			
			/**
			 * @event beforeexpand 展开之前触发该事件，如果监听的回调方法返回false,
			 * 则取消展开表格面板.
			 * @param {GridLoaderField} this
			 */
			'beforeexpand',
			
			/**
			 * @event expand 展开表格面板之后触发该事件，
			 * @param {GridLoaderField} this
			 */
			'expand', 
			
			/**
			 * @event collapse 合拢表格面板之后触发该事件
			 * @param {GridLoaderField} this
			 */
			'collapse', 
			
			/**
			 * @event beforeselect 选择数据之前触发该事件
			 * @param {GridLoaderField} this
			 * @param {Ext.data.Record} record 选择的记录
			 * @param {Ext.data.Store} store 数据源
			 */
			'beforeselect', 
			
			/**
			 * @event select 选择数据之后触发该事件
			 * @param {GridLoaderField} this
			 * @param {Ext.data.Record} record 选择的记录
			 * @param {String} value 真实的值
			 * @param {String} display 显示的值
			 */
			'select',
			
			/**
			 * @event change 值发生变化的时候触发该事件
			 * @param {GridLoaderField} this
			 * @param {String} value 新值
			 * @param {String} oldValue 老值
			 */
			'change',
			
			/**
			 * @event passed
			 * @param {GridLoaderField} this
			 * @param {String} value 新值
			 * @param {Ext.data.Record} record 选择的记录
			 */
			'passed', 
			
			/**
			 * @event unpassed
			 * @param {GridLoaderField} this
			 * @param {String} value 新值
			 * @param {String} valueField 显示字段
			 */
			'unpassed',
			
			/**
			 * @event clear
			 * @param {GridLoaderField} this
			 */
			'clear'
			);
	};

	Ext.extend(Rs.ext.form.GridLoaderField, Ext.form.TriggerField, {
		
		/**
		 * @cfg {Number} queryDelay 
		 * 查询延迟时间,默认200毫秒
		 */
		queryDelay : 200,

		/**
		 * @cfg {Number} gridWidth 
		 * 表格宽度, 默认为410
		 */
		gridWidth : 410,
		
		/**
		 * @cfg {Number} minGridWidth 
		 * 表格最小宽度, 默认为410
		 */
		minGridWidth : 410,
		
		/**
		 * @cfg {Number} maxGridWidth 
		 * 表格最大宽度, 默认为800
		 */
		maxGridWidth : 800,
		
		/**
		 * @cfg {Number} gridHeight 
		 * 表格高度, 默认为320
		 */
		gridHeight : 320,
		
		/**
		 * @cfg {Number} minGridHeight 
		 * 表格最小高度, 默认为320 
		 */
		minGridHeight : 320,
		
		/**
		 * @cfg {Number} maxGridHeight 
		 * 表格最大高度, 默认为600
		 */
		maxGridHeight : 600,
		
		/**
		 * @cfg {String} progCode 
		 * 望远镜编码
		 */
		
		/**
		 * @cfg {String} dataCompany 
		 * dblink公司号
		 */
		
		/**
		 * @cfg {String} displayField 
		 * 显示字段名称, 如果不配置该属性, 则将以表格第
		 * 二个字段为为显示字段,不存在第二个字段则以第一个字段为显示字段名称.
		 */
		
		/**
		 * @cfg {String} valueField 
		 * 值字段名称, 如果不配置, 则将以表格第一个字段为
		 * 值字段.
		 */
		
		/**
		 * @cfg {Object} queryPanelConfig 
		 * 配置查询头的查询条件,字段名一定大写<br/>
		 * 如:queryPanelConfig: {<br/>
	 	 * <pre><code>  displayQueryField: ['ACCOUNT_ID', 'ACCOUNT_NAME', 'DEPT_NAME']
		 * }</pre></code>
		 */
		
		/**
		 * @cfg {Object} gridConfig 
		 * 配置望远镜表格显示的列,列宽,字段名一定大写<br/>
		 * 如:<pre><code> gridConfig: {
		 *    columns: [{
		 * 		header: '人员编码',
		 * 		dataIndex: 'ACCOUNT_ID',
		 * 		width: 80
	     *    },{
		 * 		header: '所属部门',
		 * 		dataIndex: 'DEPT_NAME',
		 * 		width: 120
	     *    }]
		 * }</pre></code>
		 */
		
		/**
		 * @cff {String} errorValueText 
		 * 错误值提示文本
		 */
		errorValueText : '错误数据',
		
		//private
		maskRe : /[^,;'"\\]/,
		
		//private
		keyNavConfig : {
			"up" : function() {
				if(this.isExpanded()) {
					this.focusPrev();
				}
			},
			"down" : function() {
				if(!this.isExpanded()) {
					/*this.expand();
					var s = this.generalselPanel.getStore();
					if(s && s.getCount() == 0){
						this.doQuery();
					}*/
				    this.onTriggerClick();
				} else {
					this.focusNext();
				}
			},
			"enter" : function(e) {
                e.stopPropagation();
				var grid = this.generalselPanel.getGrid();
				if(this.isExpanded()){
					if(!grid.getStore().getCount()){
						this.collapse();
					}
					this.rowSelect(this.generalselPanel.grid.getSelectionModel().getSelections());
					this.onSelect();
				}
			},
			"esc" : function() {
				if(this.isExpanded()){
					this.collapse();
				}
			}, 
			'home' : function(e){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage > 1){
					pagingToolbar.moveFirst();
				}
			},
			'end' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage < data.pages){
					pagingToolbar.moveLast();
				}
			}, 
			'pageUp' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage > 1){
					pagingToolbar.movePrevious();
				}
			}, 
			'pageDown' : function(){
				var pagingToolbar = this.generalselPanel.getPagingToolbar(),
					data = pagingToolbar ? pagingToolbar.getPageData() : undefined;
				if(data && data.activePage < data.pages){
					pagingToolbar.moveNext();
				}
			} ,
			
			'tab' : function(e){
                this.collapse();
                return true;
            },
			
			scope : this,
			
			doRelay : function(e, h, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                    // this MUST be called before GridLoaderField#fireKey()
                    var relay = Ext.KeyNav.prototype.doRelay.apply(this, arguments);
                    if(!Ext.isIE && Ext.EventManager.useKeydown){
                        // call GridLoaderField#fireKey() for browsers which use keydown event (except IE)
                        this.scope.fireKey(e);
                    }
                    return relay;
                }
                return true;
            },

            forceKeyDown : true,
            defaultEventAction: 'stopEvent'
		},
		
		fireKey : function(e){
	        if (!this.isExpanded()) {
	            Rs.ext.form.GridLoaderField.superclass.fireKey.call(this, e);
	        }
	    },

		//private
		fieldKeyNavConfig : {
		/*	"enter" : function(e) {
                e.stopPropagation();
				var grid = this.generalselPanel.getGrid();
				if(this.isExpanded()
					&& grid.getSelectionModel().hasSelection()) {
					this.onSelect();
				}
			},
			"up" : function() {
				this.focusPrev();
			},
			"down" : function() {
				if(!this.isExpanded()) {
					this.onTriggerClick();
				} else {
					this.focusNext();
				}
			}*/
		},

		/**
		 * 创建查询面板
		 * @param {Object} config
		 */
		initGeneralselPanel : function(config){
			config = config || {};
			config = Ext.apply(config, {
				storeAutoLoad : false,
				queryPanelConfig : Ext.applyIf(config.queryPanelConfig || {}, {
					border : true,
					margins : "1 1 0 1"
				}),
				queryPanelCollapsed : false,
				queryPanelDisable : this.readOnly == true,  //如果望远镜为只读，隐藏表格中的查询面板
				gridConfig : Ext.applyIf(config.gridConfig || {}, {
					columns : this.columns,
					border : true,
					margins : "0 1 0 1"
				}),
				buildProgCondtion : config.buildProgCondtion ,
				width : this.gridWidth,
				height : this.gridHeight,
				border : false
			});
			var generalselPanel = new Rs.ext.grid.GeneralselPanel(config);
			return generalselPanel;
		},
		
		//override
		initEvents : function() {
			Rs.ext.form.GridLoaderField.superclass.initEvents.call(this);
			this.keyNav = new Ext.KeyNav(this.el, 
				Ext.apply(this.keyNavConfig, {
					scope : this,
					forceKeyDown : true
				}));
			this.mon(this.el, 'keyup', this.filterQuery, this);
			this.on('specialkey', this.tabKeyCollapse, this);
			this.quikTask = new Ext.util.DelayedTask(this.quickAhead, this);
		},
		
		//private
		initLayer : function() {
			this.view = new Ext.Layer( {
				constrain : false,
				shadow : "sides",
				cls : " x-combo-list "
			});
			this.view.swallowEvent("mousewheel");
			this.view.swallowEvent("mousedown");
			this.resizer = new Ext.Resizable(this.view, {
				pinned : true,
				handles : 'se',
				minWidth : this.minGridWidth,
				maxWidth : this.maxGridWidth,
				minHeight : this.minGridHeight,
				maxHeight : this.maxGridHeight
			});
			this.generalselPanel.render(this.view);
			this.initLayerEvents();
		},

		//private
		initLayerEvents : function() { 
			this.fieldKeyNav = new Ext.KeyNav(this.generalselPanel.el, 
				Ext.apply( this.fieldKeyNavConfig, {
					scope : this,
					forceKeyDown : true
				}));
			this.resizer.on('resize', function(r, w, h) {
				this.generalselPanel.setWidth(w - 2);
				this.generalselPanel.setHeight(h - 2);
			}, this);
			var grid = this.generalselPanel.getGrid();
			if(grid){
				grid.on("rowclick", this.rowClick, this, {
					delay : 20,
					scope : this
				});
			}
		},
		
		//private
		filterQuery : function(e) {
			if(this.readOnly){
				return ;
			}
            if(!e.isSpecialKey() || e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE){
                if(e.getKey() == e.BACKSPACE || e.getKey() == e.DELETE){
                    this.setValue(this.getRawValue());
                }
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
		rowClick : function(g){
			var sm;
			if(g && (sm = g.getSelectionModel())) {
				this.rowSelect(sm.getSelections());
				var s = g.getStore(), desel = [];
				s.each(function(r){
					if(sm.isSelected(r) == false){
						desel.push(r);
					}
				}, this);
				this.rowDeSelect(desel);
			}
			this.focus();
		},
		
		//private
		rowSelect : function(records) {
			this.onSelect();
		},
		
		//private
		rowDeSelect : function(records){
			
		},
		
		/**
		 * 查询数据, 如果该控件为只读readOnly = true, 且当前有值，
		 * 则查询出该值的详细信息。如果当前控件并非只读readOnly = false, 则进行模糊查询。
		 */
		doQuery : function() {
			var displayField = this.getDisplayField(),
				valueField = this.getValueField(), value,
				progCondition;
			if(this.readOnly == true){
				value = this.getValue();
				if(!Ext.isEmpty(valueField, false) && !Ext.isEmpty(value, false)){
					progCondition = valueField + ' = \'' + value + '\'';
				}else {
					progCondition = '1 <> 1';
				}
			}else {
				value = this.getRawValue();
				if(!Ext.isEmpty(displayField, false) && !Ext.isEmpty(value, false)){
					progCondition = displayField + ' like \'' + value + '%\'';
				}
			}
			progCondition = this.buildProgCondtion(progCondition);
			if(this.fireEvent('beforequery', this, progCondition) !== false){
				this.generalselPanel.query(progCondition, function(store, records, options){
					this.fireEvent('query', this, records, progCondition);
				}, this);
			}
		},
		
		/**
		 * 构建查询条件,传入参数为已有的查询条件，用户可
		 * 重写该方法以修改查询条件.
		 * @param {String} progCondition
		 */
		buildProgCondtion : function(progCondition){
			return progCondition;
		},
		
		/**
		 * 表格面板是否展开
		 * Returns true if this grid panel is expanded
		 * @return {boolean}
		 */
		isExpanded : function() {
			return this.view && this.view.isVisible();
		},

		/**
		 * 展开表格面板
		 */
		expand : function() {
			if(this.view == undefined){
				this.initLayer();
			}
			if(this.isExpanded()) {
				return;
			}
			if(this.fireEvent('beforeexpand', this) !== false){
				this.view.alignTo(this.wrap, "tl-bl?");
				this.view.show();
				Ext.getDoc().on('mousewheel', this.collapseIf, this);
				Ext.getDoc().on('mousedown', this.collapseIf, this);
				this.fireEvent('expand', this);
			}
		},
		
		//private
		beforeCollapse : Ext.emptyFn,
		
		/**
		 * 合拢表格面板
		 */
		collapse : function() {
			if(!this.isExpanded()) {
				return;
			}
			this.beforeCollapse();
			this.view.hide();
			Ext.getDoc().un('mousewheel', this.collapseIf, this);
			Ext.getDoc().un('mousedown', this.collapseIf, this);
			this.fireEvent('collapse', this);
			this.onCollapse();
		},

		//private
		onCollapse : Ext.emptyFn,
		
		//private
		collapseIf : function(e) {
			if(e && !e.within(this.wrap) && !e.within(this.view)) {
				this.collapse();
			}
		},
		
		//private
		tabKeyCollapse : function(field, e){
			if(e && e.getKey() == e.TAB){
				this.collapse();
			}
		},
		
		// private
	    // This should be overriden by any subclass that needs to check whether or not the field can be blurred.
		validateBlur : function() {
			return !this.view || !this.view.isVisible();
		},

		//private
		onTriggerClick : function() {
			if(!this.isExpanded() && !this.disabled) {
				this.expand();
				this.doQuery();
			}else {
				this.collapse();
			}
		},

		//private
		focusFirst : function() {
			var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),	
				sm = grid.getSelectionModel();
			if(store.getCount() > 0){
				sm.selectFirstRow();
			}
			this.focus();
		},

		//private
		focusLast : function() {
			var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),	
				sm = grid.getSelectionModel();
			if(store.getCount() > 0){
				sm.selectLastRow();
			}
			this.focus();
		},

		//private
		focusPrev : function() {
			var grid = this.generalselPanel.getGrid(),
				sm = grid.getSelectionModel();
			if(sm.hasSelection()) {
				sm.selectPrevious();
			} else {
				sm.selectFirstRow();
			}
			this.focus();
		},

		//private
		focusNext : function() {
			var grid = this.generalselPanel.getGrid(),
				sm = grid.getSelectionModel();
			if(sm.hasSelection()) {
				sm.selectNext();
			} else {
				sm.selectFirstRow();
			}
			this.focus();
		},

		//private
		onSelect : function() {
			if(this.readOnly){
				this.collapse();
				return;
			}
			var grid = this.generalselPanel.getGrid(),
				store = this.generalselPanel.getStore(),
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
		 * 清除值
		 */
		clearValue : function() {
			delete this.lastValue;
			this.setRawValue('');
			delete this.selectedRecord;
			this.applyEmptyText();
			this.fireEvent('clear', this);
		},

		/**
		 * 获取值
		 * @return {String} value
		 */
		getValue : function() {
			var value = this.lastValue || '';
			if (Ext.isEmpty(value)){
				delete this.selectedRecord;
			}
			return value;
		},
		
		/**
		 * 获取值Record
		 * @return {Record} record
		 */
		getValueRecord : function(){
			return this.selectedRecord;
		},
		
		/**
		 * 获取显示值的字段名称
		 * @return {String} displayField
		 */
		getDisplayField : function(){
			return this.displayField;
		},
		
		 /**
         * 设置望远镜显示值
         * @param {String} valueField 显示值
         */
		setDisplayField : function(displayField){
		   this.displayField = displayField ;
		} ,
		
		/**
		 * 获取值的字段名称
		 * @return {String} valueField
		 */
		getValueField : function(){
			return this.valueField;
		},

        /**
         * 设置望远镜拿到后台的值
         * @param {String} valueField 真正的值
         */
		setValueField : function(valueField){
		      this.valueField = valueField ;
		} ,
		
		/**
		 * 设置值
		 * @param {String} value 值
		 */
		setValue : function(value) {
			delete this.selectedRecord;
			var valueField = this.getValueField(),
				displayField = this.getDisplayField(),
				progCondition;
			if(!Ext.isEmpty(valueField, false) && !Ext.isEmpty(value, false)){
				
				this.lastValue = value ;
                Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
				
				progCondition = valueField + ' = \'' + value + '\'';
				progCondition = this.buildProgCondtion(progCondition);
				this.generalselPanel.query(progCondition, function(store, records){
					var record = store.query(valueField, new RegExp("^" + value + "$")).get(0);
					if(record){
						if(this.generalselPanel.rendered){
							this.el.dom.value = record.get(displayField);
						}else {
							this.generalselPanel.on('render', function(){
								this.el.dom.value = record.get(displayField);
							}, this, {
								single : true,
								scope : this
							});
						}
						var oldValue = this.lastValue;
						this.lastValue = record.get(valueField);
						this.selectedRecord = record;
						this.fireEvent('change', this, this.lastValue, oldValue);
						this.fireEvent("passed", this, record.get(valueField), record);
					}else {
						this.fireEvent("unpassed", this, value, valueField);
						this.applyEmptyText();
					}
				}, this);
			} else if(value!==undefined && value.length == 0){
                this.lastValue = value;
                Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
            } else {
            	this.lastValue = value;
                Rs.ext.form.GridLoaderField.superclass.setValue.call(this,value);
				this.fireEvent("unpassed", this, value, valueField);
				this.applyEmptyText();
			}
		},
		
		//private
		//重写父类方法, 显示trigger
		updateEditState: function(){
	        if(this.rendered){
	            if (this.readOnly) {
	                this.el.dom.readOnly = true;
	                this.el.addClass('x-trigger-noedit');
	                //this.mun(this.el, 'click', this.onTriggerClick, this);
	                //this.trigger.setDisplayed(false);
	            } else {
	                if (!this.editable) {
	                    this.el.dom.readOnly = true;
	                    this.el.addClass('x-trigger-noedit');
	                    this.mun(this.el, 'click', this.onTriggerClick, this);
	                    this.mon(this.el, 'click', this.onTriggerClick, this);
	                } else {
	                    this.el.dom.readOnly = false;
	                    this.el.removeClass('x-trigger-noedit');
	                    this.mun(this.el, 'click', this.onTriggerClick, this);
	                }
	                this.trigger.setDisplayed(!this.hideTrigger);
	            }
	            this.onResize(this.width || this.wrap.getWidth());
	        }
	    },
	    
	    /**
	     * 设置该控件是否只读，如果为true表示
	     * @param {Boolean} readOnly 
	     */
	    setReadOnly: function(readOnly){
	    	Rs.ext.form.GridLoaderField.superclass.setReadOnly.apply(this, arguments);
	    	this.generalselPanel.setQueryPanelDisable(readOnly == true);
	    },
	    
		//private
		focus : function() {
			Rs.ext.form.GridLoaderField.superclass.focus.defer(25, this);
		}, 
		
		
	    /**
	     * 重写{@link Ext.form.Field#isValid}方法, 取真是的值进行验证,
	     * 而不是显示的值.
	     * Returns whether or not the field value is currently valid by
	     * {@link #validateValue validating} the {@link #processValue processed value}
	     * of the field. <b>Note</b>: {@link #disabled} fields are ignored.
	     * @param {Boolean} preventMark True to disable marking the field invalid
	     * @return {Boolean} True if the value is valid, else false
	     */
	    isValid : function(preventMark){
	        if(this.disabled){
	            return true;
	        }
	        var restore = this.preventMark;
	        this.preventMark = preventMark === true;
	        var v = this.validateValue(this.processValue(this.getValue()));
	        this.preventMark = restore;
	        return v;
	    },

	    /**
	     * Validates the field value 
	     * 重写{@link Ext.form.Field#validate}的validate方法，取真实的值进行验证,
	     * 而不是显示的值
	     * @return {Boolean} True if the value is valid, else false,
	     */
	    validate : function(){
	        if(this.disabled || this.validateValue(this.processValue(this.getValue()))){
	            this.clearInvalid();
	            return true;
	        }
	        return false;
	    },
		
		/**
		 * 获取错误信息
		 * @param {String} value
		 * @return {Array}
		 */
		getErrors: function(value) {
			var errors = Rs.ext.form.GridLoaderField.superclass.getErrors.apply(this, arguments);
			value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());
			var valueError = this.getValueError(value);
			valueError != undefined ? errors.push(valueError):null;
			return errors;
		},
		
		//private
		getValueError : function(value){
			if(this.selectedRecord != undefined){
				var valueField = this.getValueField(),	
	        		value1 = this.selectedRecord.get(valueField);
	        	if(value1 != value){
					return this.errorValueText;
				}
	        }
		},
		
		//private
		onDestroy : function(){
			if(this.quikTask){
				this.quikTask.cancel();
				this.quikTask = null;
			}
			var grid = this.generalselPanel.getGrid();
			if(grid){
				grid.un("rowclick", this.rowClick, this);
			}
			this.un('specialkey', this.tabKeyCollapse, this);
			Rs.ext.form.GridLoaderField.superclass.onDestroy.call(this);
		} ,
		
		/**
		 * @method setProgCode
		 * @param {String} progCode 望远镜编码
		 * @param {String} progCondition 望远镜条件
		 * 动态修改望远镜编码以及查询条件
		 */
		setProgCode : function(progCode , progCondition){
            this.progCode = progCode ;  
            this.progCondition = progCondition ;
            this.generalselPanel.setProgCode(this.progCode , this.progCondition) ;
        },
        
        /**
		 * @method setDataCompany
		 * @param {String} dataCompany dblink公司号
		 * 动态设置dblink公司号
		 */
        setDataCompany: function(dataCompany){
        	this.dataCompany = dataCompany ;
            this.generalselPanel.setDataCompany(this.dataCompany) ;
        }
	});

	Ext.ComponentMgr.registerType("rs-ext-gridloaderfield", Rs.ext.form.GridLoaderField);

})();
