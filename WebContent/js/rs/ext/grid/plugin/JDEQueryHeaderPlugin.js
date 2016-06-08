Rs.ns('Rs.ext.grid.plugin');
Rs.ext.grid.plugin.JDEQueryHeaderPlugin = function(config){
	Rs.apply(this, config);
	Rs.ext.grid.plugin.JDEQueryHeaderPlugin.superclass.constructor.call(this, config);
	
	this.addEvents(
		
		/**
		 * @event beforequery
		 * @param {Rs.ext.grid.plugin.JDEQueryHeaderPlugin} jdePlugin
		 * @param {Object} params
		 */
		'beforequery',
		
		/**
		 * @event query
		 * @param {Rs.ext.grid.plugin.JDEQueryHeaderPlugin} jdePlugin
		 * @param {Object} params
		 */
		'query');
};
Ext.extend(Rs.ext.grid.plugin.JDEQueryHeaderPlugin, Ext.util.Observable, {
	
	/**
	 * @cfg {Array} jdeCondition
	 */
	jdeCondition:[],
	
	init: function(grid){
		this.grid = grid;
		this.view = grid.getView();
		
		this.grid.on({
			'columnmove': this.moveColumn,
			'columnresize': this.resizeColumn,
			scope: this
		});
		
		this.grid.getColumnModel().on('hiddenchange', this.hiddenColumn, this);
		grid.on('render', this.doCreateJDEDom, this);
		
		this.view.on('refresh', this.layout, this, {
			delay: 200
		});
		
		this.view.afterMethod('syncScroll', this.syncJdeScroll, this);
		
		
		this.checkStatePlugin();
		this.validateJdeCondition();
		
		this.initTemplates();
		this.ininJdeButtom();
		
		this.jdeHeader = this.render();
		
		this.initEditor.defer(500, this);
	},
	
	/**
	 * 创建JDE节点
	 * @private
	 * @method doCreateJDEDom
	 */
	doCreateJDEDom: function(grid){
		var el = grid.el;
		var panelBody = el.query('.x-grid3-viewport');
		var pel = Ext.get(panelBody[0]);
		var dh = Ext.DomHelper;
		this.jdebrwp = dh.insertFirst(pel, {
			tag: 'div'
		}, true);
		this.jdebrwp.dom.className = 'x-grid3-jde'
		this.view.jdebrwp = this.jdebrwp;
		this.jdebrwp.dom.innerHTML = this.jdeHeader;
		
		this.initKeyNav();
	},
	
	/**
	 * @private 
	 * @method initKeyNav
	 */
	initKeyNav: function(){
		var jdeEl = Ext.get(this.jdebrwp);
		this.keyNav = new Ext.KeyNav(jdeEl, {
			'tab': function(e){
				e.stopEvent();
				if(e.shiftKey){
					this.walkEditor(e, true);
				} else {
					this.walkEditor(e);
				}
			},
			'enter': function(){
				this.doQuery();
			},
			scope: this,
			forceKeyDown : true
		});
	},
	
	walkEditor: function(e, shiftKey){
		var target = e.target;
		var tdDom = Ext.get(target).findParent('td');
		var index = tdDom.className.substr(-1,1);
		var endFlag = false;
		
		var key = [];
		
		for(var p in this.editorIndex){
			key.push(Number(p));
		}
		key.sort(function(a, b){
			if(a > b){
				return 1;
			} else {
				return -1;
			}
		});
		
		if(shiftKey){
			while(tdDom.previousSibling && !endFlag){
				var nextClassName = tdDom.previousSibling.className;
				var nextIndex = nextClassName.substr(nextClassName.lastIndexOf('-') + 1);
				if(key.indexOf(Number(nextIndex)) > -1){
					this.editorIndex[nextIndex].focus();
					endFlag = true;
				} else {
					tdDom = tdDom.previousSibling;
				}
			}
		} else {
			
			var findIndex = function(){
				var cm = this.grid.getColumnModel() ;
		    	var total = cm.getColumnCount();
		    	var index = 0;
		    	for(var i=0;i<total;i++){
		    		var result = cm.isCellEditable(i, 0);
		    		if(result && !cm.isHidden(i)){
		    			index = i;
		    			break ;
		    		}
		    	}
		    	return index;
			};
			
			while(tdDom.nextSibling && !endFlag){
				var nextClassName = tdDom.nextSibling.className;
				var nextIndex = nextClassName.substr(nextClassName.lastIndexOf('-') + 1);
				if(key.indexOf(Number(nextIndex)) > -1){
					this.editorIndex[nextIndex].focus();
					endFlag = true;
				} else {
					if(Number(nextIndex) > key[key.length - 1]){
						var col = findIndex.call(this);
						this.view.focusCell(0,col);
						endFlag = true;
					}
					tdDom = tdDom.nextSibling;
				}
			}
		}
	},
	
	/**
	 * 判断是否存在StatePlugin
	 */
	checkStatePlugin: function(){
		var plugins = this.grid.plugins;
		for(var i=plugins.length - 1; i>=0;i--){
			var plugin = plugins[i];
			if(plugin instanceof Rs.ext.state.StatePlugin){
				plugin.on('staterestore', this.applyState, this);
			}
		}
	},
	
	validateJdeCondition: function(){
		var jdeCondition = this.jdeCondition,
			cm = this.grid.getColumnModel();
		
		if(Ext.isEmpty(jdeCondition) || !Ext.isArray(jdeCondition)){
			return ;
		}
		
		var columns = [];
		for(var k = cm.getColumnCount() - 1;k>=0;k--){
			var column = cm.getColumnAt(k);
			columns.push(column['dataIndex']);
		}
		
		//检测配置的条件是否存在
		for(var i=0,len=jdeCondition.length;i<len;i++){
			var con = jdeCondition[i],
				dataIndex = con['dataIndex'];
			var colConfig = cm.config;
			if(columns.indexOf(dataIndex) === -1){
				throw Rs.error('jdeCondition is error');
			}
		}
	},
	
	layout: function(){
        var grid       = this.grid,
	        gridEl     = grid.getGridEl(),
	        gridSize   = gridEl.getSize(true),
	        gridHeight = gridSize.height,
	        gridWidth = gridSize.width,
            gridView = this.view,
            scroller   = gridView.scroller,
            headerHeight;
        
        if (!grid.autoHeight) {
        	headerHeight = gridView.mainHd.getHeight();
            scrollHeight = gridHeight - headerHeight - this.jdebrwp.getHeight();
            scroller.setHeight(scrollHeight);
            
            var jdeInner = this.view.el.query('.x-grid3-jde-inner')[0];
            if (jdeInner) {
            	jdeInner.style.width = (gridWidth) + "px";
            }
        }
	},
	
	syncJdeScroll: function(){
		var mb = this.view.scroller.dom;
		var el = this.view.el;
		var jdeInner = el.query('.x-grid3-jde-inner')[0];
        if (jdeInner) {
        	jdeInner.scrollLeft = mb.scrollLeft;
        	jdeInner.scrollLeft = mb.scrollLeft;
        }
	},
	
	/**
	 * @private 
	 * 初始化JDE查询头的编辑器
	 * @method initEditor
	 */
	initEditor: function(){
		this.jdeEditors = [];
		this.editorIndex = [];
		var obj = {};
		var jdeCondition = this.jdeCondition;
		for(var i=0,len=jdeCondition.length;i<len;i++){
			var con = jdeCondition[i],
				dataIndex = con['dataIndex'],
				editor = con['editor'];
			var col = this.grid.getColumnModel().findColumnIndex(dataIndex);
			var divEl = Ext.get(this.grid.getEl().query('.x-grid3-jde-' + col)[0]),
				width = divEl.getWidth(),
				id = divEl.id;
			
			if(Ext.isObject(editor)){
				if(editor.xtype){
					var edi = Ext.create({
						width: width,
						renderTo: id
					}, editor.xtype);
					this.jdeEditors.push({
						dataIndex: dataIndex,
						editor: edi
					});
					obj[col] = edi;
				} else {
					var config = editor.initialConfig || {};
					Ext.apply(config, {
						width: width
					})
					editor = Ext.create(config, editor.getXType())
					this.jdeEditors.push({
						dataIndex: dataIndex,
						editor: editor
					});
					obj[col] = editor;
					editor.render(id);
				}
			} else if(Ext.isBoolean(editor) || !editor){
				var edi = new Ext.form.TextField({
					width: width,
					renderTo: id
				});
				this.jdeEditors.push({
					dataIndex: dataIndex,
					editor: edi
				});
				obj[col] = edi;
			} else {
				throw Rs.error('jdeCondition is error');
			}
			this.editorIndex = obj;
		}
	},
	
	/**
	 * 初始化按钮
	 */
	ininJdeButtom: function(){
		this.grid.getTopToolbar().add('-',{
			xtype: 'button',
			text: 'JDE查询',
			iconCls: 'rs-action-query',
			handler: this.doQuery,
			scope: this
		});
		this.grid.getTopToolbar().add({
			xtype: 'button',
			text: 'JDE重置',
			iconCls: 'rs-action-reset',
			handler: this.doReset,
			scope: this
		}, '-');
	},
	
    /* -------------------------------- UI Specific ----------------------------- */
    /**
     * The master template to use when rendering the GridView. Has a default template
     * @property Ext.Template
     * @type masterTpl
     */
    masterTpl: new Ext.Template(
        '<div class="x-grid3-jde-inner">',
            '<div class="x-grid3-jde-offset" style="{ostyle}">{jde}</div>',
        '</div>',
        '<div class="x-clear"></div>'
    ),
    
    jdeTpl: new Ext.Template(
        '<table border="0" cellspacing="0" cellpadding="0">',
            '<thead>',
                '<tr class="x-grid3-hd-row">{cells}</tr>',
            '</thead>',
        '</table>'
    ),
    
    jdeCellTpl: new Ext.Template(
        '<td class="x-grid3-jde x-grid3-cell x-grid3-td-{id}" tabIndex="0">',
            '<div class=" x-grid3-jde-{id}" unselectable="on" style="{istyle}">', 
                '{value}',
            '</div>',
        '</td>'
    ),
    
    initTemplates: function(){
    	var templates = {}, name;
    	
    	Ext.apply(templates, {
    		master: this.masterTpl,
    		jde: this.jdeTpl,
    		jdeCell: this.jdeCellTpl
    	});
    	
    	for (name in templates) {
            template = templates[name];
            if (template && Ext.isFunction(template.compile) && !template.compiled) {
                template.compile();
            }
        }

        this.templates = templates;
    },
    
    render: function(){
    	var templates = this.templates;
    	
    	return templates.master.apply({
            jde: this.renderJDE(),
            ostyle: 'width:' + this.getOffsetWidth() + ';'
        });
    },
    
    // private
    getOffsetWidth : function() {
        return (this.grid.getColumnModel().getTotalWidth() + this.getScrollOffset()) + 'px';
    },

    // private
    getScrollOffset: function() {
        return Ext.num(this.view.scrollOffset, Ext.getScrollBarWidth());
    },
    
    renderJDE: function(){
    	var templates = this.templates;
        return templates.jde.apply({
        	cells: this.renderJDECell()
        });
    },
    
    renderJDECell: function(){
    	var templates = this.templates;
    	
    	var colCount   = this.grid.getColumnModel().getColumnCount();
    	var last = colCount - 1;
    	var cells = [], cssCls;
    	for(var i=0;i<colCount;i++){
    		if (i == 0) {
                cssCls = 'x-grid3-cell-first ';
            } else {
                cssCls = i == last ? 'x-grid3-cell-last ' : '';
            }
    		
    		var property = {
    			id: i,
    			istyle  : this.getColumnStyle(i, true),
    		};
    		cells[i] = templates.jdeCell.apply(property);
    	}
    	return cells.join('');
    },
    
    
    /**
     * @private
     * Builds a CSS string for the given column index
     * @param {Number} colIndex The column index
     * @param {Boolean} isHeader True if getting the style for the column's header
     * @return {String} The CSS string
     */
    getColumnStyle : function(colIndex, isHeader) {
       var colModel  = this.grid.getColumnModel(),
            colConfig = colModel.config,
            style     = isHeader ? '' : colConfig[colIndex].css || '',
            align     = colConfig[colIndex].align;
        
        style += String.format("width: {0};", this.getColumnWidth(colIndex));
        
        if (colModel.isHidden(colIndex)) {
            style += 'display: none; ';
        }
        
        if (align) {
            style += String.format("text-align: {0};", align);
        }
        style += 'padding:0px;';
        return style;
    },
    
    getColumnWidth: function(column){
    	var columnWidth = this.grid.getColumnModel().getColumnWidth(column),
        borderWidth = this.grid.view.borderWidth;
	    if (Ext.isNumber(columnWidth)) {
	        if (Ext.isBorderBox) {
	            return columnWidth + "px";
	        } else {
	            return Math.max(columnWidth - borderWidth, 0) + "px";
	        }
	    } else {
	        return columnWidth;
	    }
    },
    
    /**
     * 
     */
    applyState: function(stateplugin, scheme){
    	if(scheme && scheme.stateData) {
    		for(var i=this.grid.getColumnModel().getColumnCount() - 1;i>=0;i--){
    			this.updateJdeColumnWidth(i);
    		}
    	}
    },
    
    /**
     * 列交换位置
     */
    moveColumn: function(col1, col2){
		if(col1 > col2){
			for(var i=col2;i<=col1;i++){
				this.updateJdeColumnWidth(i);
			}
		} else {
			for(var i=col1;i<=col2;i++){
				this.updateJdeColumnWidth(i);
			}
		}
		
    	if(this.jdeEditors){
    		var oldValues = {}, edit, dataIndex;
    		for(var i=this.jdeEditors.length-1;i>=0;i--){
    			
    			edit = this.jdeEditors[i]['editor']; 
    			dataIndex = this.jdeEditors[i]['dataIndex'];
    			value = edit.getValue();
    			
    			if(!Ext.isEmpty(value)){
    				oldValues[dataIndex] = value;
    			}
    			
    			edit.destroy();
    			delete edit; 
    		}
    		this.initEditor();
    		
    		for(var i=this.jdeEditors.length-1;i>=0;i--){
    			edit = this.jdeEditors[i]['editor']; 
    			dataIndex = this.jdeEditors[i]['dataIndex'];
    			
    			if(!Ext.isEmpty(oldValues[dataIndex])){
    				edit.setValue(oldValues[dataIndex]);
    			}
    		}
    		
    	}
    },
    
    /**
     * 列大小发生改变
     * @privte
     * @method resizeColumn
     * @param {Number} colIndex
     * @param {Number} newSize
     */
    resizeColumn: function(colIndex, newSize){
    	var cm = this.grid.getColumnModel().config;
    	var dataIndex = cm[colIndex]['dataIndex'];
    	for(var i=this.jdeEditors.length-1;i>=0;i--){
    		if(this.jdeEditors[i]['dataIndex'] == dataIndex){
    			var editor = this.jdeEditors[i]['editor'];
    			editor.setWidth(newSize);
    			break;
    		}
		}
    	
    	var el = this.grid.getEl();
    	var jdeDiv = el.query('div.x-grid3-jde-' + colIndex)[0];
    	var jdeDivEl = Ext.get(jdeDiv);
    	jdeDivEl.setWidth(newSize);
    },
    
    /**
     * 列隐藏/显示
     * @privte
     * @method hiddenColumn
     * @param {Number} colIndex
     * @param {Boolean} hidden
     */
    hiddenColumn: function(column, colIndex, hidden){
    	this.updateJdeColumnWidth(colIndex);
    	var jdeTdEl = Ext.get(this.grid.getEl().query('.x-grid3-td-' + colIndex)[0]); 
    	jdeTdEl.setStyle('display',hidden ? 'none': '');
    	
    	if(this.jdeEditors){
    		for(var i=this.jdeEditors.length-1;i>=0;i--){
    			this.jdeEditors[i]['editor'].destroy();
    			delete this.jdeEditors[i]; 
    		}
    		this.initEditor();
    	}
    },
    
    /**
     * 更新JDE头的列宽度
     * @private
     * @method updateJdeColumnWidth
     * @param {Number} colIndex
     */
    updateJdeColumnWidth: function(colIndex){
    	var el = this.grid.getEl();
    	var jdeDiv = el.query('div.x-grid3-jde-' + colIndex)[0];
    	var jdeDivEl = Ext.get(jdeDiv);
    	var cm = this.grid.getColumnModel().config;
    	jdeDivEl.setWidth(this.getColumnWidth(colIndex));
    },
    
    /**
     * JDE重置方法
     * @method doReset
     * @params
     */
    doReset: function(){
    	for(var i=this.jdeEditors.length-1;i>=0;i--){
			var editor = this.jdeEditors[i]['editor'];
			editor.reset();
		}
    },
    
    /**
     * JDE查询方法
     * @method doQuery
     * @params
     */
    doQuery: function(){
    	var params = this.getParams();
    	if(params && this.fireEvent("beforequery", this, params) !== false) {
             if(this.store) {
                 if(this.queryCallback){
                     var param = this.getSQL(params);
                     this.queryCallback.call(this.queryScope, param);
                 } else{
                     Ext.apply(params, this.store.baseParams || this.grid.store.baseParams || {});
                     this.store.load( { 
                         params : params
                     });
                 }
         } else if(this.grid && this.grid.store){
                 if(this.queryCallback){
                     var param = this.getSQL(params);
                     this.queryCallback.call(this.queryScope, param);
                 } else{
                     Ext.apply(params, this.grid.store.baseParams || {});
                     params.metaData.start = 0 ;
                     this.grid.store.load( { 
                         params : params
                     });
                 }
             }
             this.fireEvent("query", this, params);
         }
    },
    
    /**
     * 获得JDE查询头的参数
     * @method getParams
     * @return {Object} params
     */
    getParams: function(){
    	var params = {};
    	for(var i=this.jdeEditors.length-1;i>=0;i--){
			var editor = this.jdeEditors[i]['editor'], 
				dataIndex = this.jdeEditors[i]['dataIndex'],
				value = editor.getValue();
			if(!Ext.isEmpty(value)){
				params[dataIndex] = value;
			}
		}
    	return params;
    }
});