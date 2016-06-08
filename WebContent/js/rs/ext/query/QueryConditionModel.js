Ext.ns("Rs.ext.query");

(function() {
	/**
	 * @class Rs.ext.query.QueryConditionModel
	 * <p>查询条件</p>
	 * @extends Ext.util.Observable
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.query.QueryConditionModel = function(config) {
		Ext.apply(this, config || {});
		Rs.ext.query.QueryConditionModel.superclass.constructor.call(this, config);
		if(this.conditions) {
			this.setConditions(this.conditions, true);
		}
		this.addEvents(
		/**
		 * @event beforeselectcondition 
		 * @param {Rs.ext.query.QueryConditionModel} qcModel
		 * @param {Rs.ext.query.Condition} condition 
		 */
		'beforeselectcondition',
		/**
		 * @event selectcondition 
		 * @param {Rs.ext.query.QueryConditionModel} qcModel
		 * @param {Rs.ext.query.Conditon} conditon 
		 */
		'selectcondition',
		/**
		 * @event beforeunselectcondition
		 * @param {Rs.ext.query.QueryConditionModel} qcModel
		 * @param {Rs.ext.qeury.Conditon} conditon
		 */
		'beforeunselectcondition',
		/**
		 * @event unselectcondition 
		 * <p>删除某个查询条件后，触发该事件</p>
		 * @param {Rs.ext.query.QueryConditionModel} qcModel
		 * @param {Rs.ext.qeury.Conditon} conditon
		 */
		'unselectcondition');
	};
	
	Ext.extend(Rs.ext.query.QueryConditionModel, Ext.util.Observable, {

		// private
		setConditions : function(conditions, initial) {
			var i, 
				c, 
				len;
			this.lookup = {};
			for(i = 0, len = conditions.length; i < len; i++) {
				c = Ext.applyIf(conditions[i], this.defaults);
				if(Ext.isEmpty(c.dataIndex)) {
					Rs.error('dataIndex is undefined');
				}
				if(!c.isNotCondition) {
					c = new Rs.ext.query.Condition( {
						filter : c,
						qcModel : this
					});
				}
				this.lookup[c.getDataIndex()] = c;
			}
		},

		/**
		 * <p>遍历查询条件DataIndex</p>
		 * @param {Function} fn
		 * @param {Object} scope
		 */
		eachFilterDataIndex : function(fn, scope) {
			var di;
			for(di in this.lookup) {
				if(fn.call(scope || this, di) === false) {
					break;
				}
			}
		},

		/**
		 * <p>遍历查询条件</p>
		 * @param {Function} fn
		 * @param {Object} scope
		 */
		eachCondition : function(fn, scope) {
			var di, 
				c;
			for(di in this.lookup) {
				c = this.lookup[di];
				if(fn.call(scope || this, c) === false) {
					break;
				}
			}
		},

		/**
		 * <p>获取查询条件</p>
		 * @return {Array}
		 */
		getConditions : function() {
			var c, 
				cods = [];
			for( var i in this.lookup) {
				c = this.lookup[i];
				c ? cods.push(c) : null;
			}
			return cods;
		},

		/**
		 * <p>根据dataIndex获取查询条件</p>
		 * @param {String} dataIndex
		 * @return {Rs.ext.query.Condition}
		 */
		getConditionByDataIndex : function(dataIndex) {
			var di, 
				c;
			for(di in this.lookup) {
				if(di === dataIndex) {
					return this.lookup[di];
				}
			}
		},

		//private
		onSelectionCondition : function(panel, condition) {
			var di = condition.getDataIndex();
			condition = this.lookup[di];
			if(panel && condition
				&& this.fireEvent('beforeselectcondition', this, condition) != false) {
				condition.filter.hidden = false;
				panel.add(condition);
				panel.doLayout();
				this.fireEvent('selectcondition', this, condition);
			}
		},

		// private
		onUnSelectcondition : function(condition) {
			if(condition
				&& this.fireEvent('beforeunselectcondition', this, condition) != false) {
				var di = condition.getDataIndex(), 
					ct = condition.ownerCt,
					filter = condition.getFilter();
				if(ct) {
					ct.remove(condition, true);
					ct.doLayout();
					ct.syncSize();
					condition.destroy();
				}
				delete this.lookup[di];
				var c = new Rs.ext.query.Condition( {
					filter : Ext.apply(filter, { 
						hidden : true
					}),
					qcModel : this
				});
				this.lookup[di] = c;
				this.fireEvent('unselectcondition', this, c);
			}
		},

		// private override
		destroy : function() {
			var di, 
				c;
			for(di in this.lookup) {
				c = this.lookup[di];
				c.destory();
			}
			delete this.lookup;
		}

	});

	/**
	 * @class Rs.ext.query.Condition
	 * <p>查询条件控件</p>
	 * @extend Ext.Panel
	 * @package Rs.ext.query
	 */
	Rs.ext.query.Condition = function(config) {
		Ext.apply(this, config || {});
		this.addEvents(
		/**
		 * @event change
		 * 
		 */
		['change']);
		this.setEditor(this.filter.editor);
		Rs.ext.query.Condition.superclass.constructor.call(this, config);
	};

	Ext.extend(Rs.ext.query.Condition, Ext.Panel, {
		//private
		width : 200,

		// private
		layout : 'column',

		// private
		cls : 'rs-query-condition-panel ',

		// private
		columns : 2,

		// priavte
		border : false,

		//private
		initComponent : function() {
			Rs.ext.query.Condition.superclass.initComponent.call(this);
			this.add( {
				cls : 'x-toolbar',
				width : 90,
				height : 26,
				border : false,
				items : [ this.createMenuButton() ]
			});
			this.add( {
				columnWidth : 1,
				border : false,
				layout : 'fit',
				height : 24,
				bodyStyle : 'padding:1px',
				items : [ this.editor ]
			});
		},

		// private
		createMenuButton : function() {
			var text = this.filter.header || this.filter.dataIndex;
			this.menu = new Ext.menu.Menu( { 
				items : [{
					cls : 'query-panel-remove-icon',
					text : '删除',
					handler : this.onUnSelect,
					scope : this,
					hideDelay : 1
				}]
			});
			return this.menuButton = new Ext.Button( {
				minWidth : 80,
				maxWidth : 80,
				text : text,
				cls : 'query-field-button',
				menu : this.menu
			});
		},

		//private
		onUnSelect : function() {
			this.qcModel.onUnSelectcondition(this);
		},

		/**
		 * <p>该查询条件是否隐藏</p>
		 * @return {Boolean}
		 */
		isHidden : function() {
			return this.filter.hidden === true;
		},

		/**
		 * <p>获取控件名称</p>
		 * @return {String}
		 */
		getFilterHeader : function() {
			return this.filter.header || this.filter.dataIndex;
		},

		/**
		 * @param {String} attr
		 * @return {Object} 
		 */
		getFilterAttr : function(attr) {
			return this.filter[attr];
		},

		/**
		 * return the filter
		 * @return {Object} filter
		 */
		getFilter : function() {
			return this.filter;
		},

		/**
		 * return the dataIndex of filter
		 * @return {String} dataIndex
		 */
		getDataIndex : function() {
			return this.filter.dataIndex;
		},

		// private
		setEditor : function(editor) {
			this.editor = null;
			if(editor) {
				if(!editor.isXType) {
					this.editor = Ext.create(editor, 'textfield');
				} else {
					this.editor = Ext.apply( {}, editor);
				}
				this.relayEvents(this.editor,['change']);
			}
		},

		/**
		 * @return {Boolean}
		 */
		validate : function() {
			return this.editor && this.editor.validate();
		},

		/**
		 * <p>获取值</p>
		 * @return {String}
		 */
		getValue : function() {
			var value = this.editor.getValue();
			if(value == undefined || value == '') {
				return undefined;
			}
			if(this.filter.wrapper && Ext.isFunction(this.filter.wrapper)) {
				return this.filter.wrapper.call(this, value);
			}
			return value;
		},

		/**
		 * <p>获取值</p>
		 * @return {Object} 
		 */
		getRawValue : function() {
			var value = this.editor.getValue();
			if(value == undefined || value == '') {
				return undefined;
			}
			return value;
		},

		/**
		 * setValue
		 * @param {Object} value
		 */
		setValue : function(v) {
			v && this.editor && this.editor.setValue(v);
		},

		/**
		 * reset
		 */
		resetValue : function() {
			this.editor && this.editor.reset();
		},

		//private
		destroy : function() {
			Rs.ext.query.Condition.superclass.destroy.apply(this, arguments);
			this.editor = null;
		}
	});
})();