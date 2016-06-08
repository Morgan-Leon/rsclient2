Ext.ns("Rs.ext.query");

(function() {
    /**
     * @class Rs.ext.query.QueryPanel <p>查询面板</p>
     * @extends Ext.Panel
     * @constructor
     * @param {Object} config
     */
    Rs.ext.query.QueryPanel = function(config) {
        Ext.apply(this, config || {
            layout : 'column'
        });
        if(this.isPop){
            this.bbar = new Ext.Toolbar({items : ['->']});
        }
        
        this.editors = {};
        
        Rs.ext.query.QueryPanel.superclass.constructor.call(this, config);
        this.addEvents(
        /**
         * @event beforeselectcondition 
         * @param {Rs.ext.query.Condition} condition 
         * @param {Object} filter
         */
        'beforeselectcondition',
        /**
         * @event selectcondition
         * @param {Rs.ext.query.Conditon} conditon
         * @param {Object} filter
         */
        'selectcondition',
        /**
         * @event beforeunselectcondition 
         * @param {Rs.ext.qeury.Conditon} conditon
         * @param {Object} filter
         */
        'beforeunselectcondition',
        /**
         * @event unselectcondition 
         * <p>删除某个查询条件后，触发该事件</p>
         * @param {Rs.ext.qeury.Conditon} conditon
         * @param {Object} filter
         */
        'unselectcondition',
        /**
         * @event beforequery 
         * <p>查询之前执行触发该事件，如果监听该事件的回调方法返回false 则终止该操作</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         * @param {Object} params 
         */
        'beforequery',
        /**
         * @event query 
         * <p>查询</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         * @param {Object} params
         */
        'query',
        /**
         * @event reset 
         * <p>重置</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         */
        'reset');
        
        this.on('resize', function(){
            if(this.ownerCt){
                this.ownerCt.doLayout();
            }
        },this, {delay: 10});
    };

    Ext.extend(Rs.ext.query.QueryPanel, Ext.Panel, {

        /**
         * @cfg {Boolean} animCollapse
         */
        animCollapse : false,
        
        /**
         * @cfg {Boolean} isPop
         * 是否为弹出式, 默认为false
         */
        isPop : false,
        
        bodyCfg : {
                cls : 'rs-query-panel-body'
            },
            
        // private
        bodyStyle : 'padding:5px;',

        // private
        cls : 'rs-query-panel',

        /**
         * @cfg {Boolean} autoHeight
         */
        autoHeight : true,

        /**
         * @cfg {Boolean} autoScroll
         */
        autoScroll : true,
        
        /**
         * @cfg {Object} defaults
         */
        defaults : { 
            border : false
        },
        
        /**
         * @cfg {Number} widgetWidth
         * 组件宽度 默认230 如果没有出现组件名字过长折行的问题，请不要修改
         */
        widgetWidth : 230 ,
        
        /**
         * @cfg {Number} labelWidth
         * 组件label宽度 默认100 如果没有出现组件名字过长折行的问题，请不要修改
         */
        labelWidth : 100 ,

        // private
        layout : 'column',
        
        //private
		keyNavConfig : {
			"enter" : function(e) {
				var target = Ext.get(e.getTarget());
				if(!target.hasClass('x-btn-text')){
					this.doQuery();
				}
				return true ;
			}
		},
		
        // override
        initComponent : function() {
            Rs.ext.query.QueryPanel.superclass.initComponent.call(this);
            this.addActionsButtons();
            if(Ext.isArray(this.conditions)) {
                var conds = this.conditions;
                for(var i = 0; i < conds.length; i++){
                    if(conds[i].editor){
                        this.addConditionToPanel(conds[i]);
                        this.addConditionToMenu(conds[i], !conds[i].hidden);
                    }
                }
            }
        },
        
        addConditionToPanel : function(c){
            var addflag = false;
            if(this.items){
                this.items.each(function(item){
                    if(item.dataIndex == c.dataIndex){
                        item.show();
                        try {
                        	this.syncSize();
                        } catch(e) {
                        	
                        }
                        addflag = true;
                        return false;
                    }
                },this);
                if(addflag){
                    return;
                }
            }
            var editor = {};
            if(!c.editor.isXType){
                editor = Ext.create(Ext.applyIf(c.editor || {}, {
                    fieldLabel : c.header,
                    labelStyle: 'text-align:right;width:' + this.labelWidth + "px;",
                    width : 120
                }), 'textfield');
            } else{
                editor = Ext.applyIf(c.editor, {
                    labelStyle: 'text-align:right;width:' + this.labelWidth + "px;",
                    fieldLabel : c.header,
                    width : 120
                });
            }
            this.editors[c.dataIndex] = editor.id;
            this.add({
                layout : 'form',
                bodyCfg : {cls : 'rs-query-panel-body'},
                width : this.widgetWidth ,
                dataIndex : c.dataIndex,
                hidden : c.hidden,
                labelWidth : this.labelWidth,
                items : [editor]});
            if(this.rendered){
                this.syncSize();
            }
        },
        
        getEditor : function(index){
            return this.findById(this.editors[index]);
        },
        
        removeConditionFromPanel : function(index){
            this.items.each(function(item){
                if(item.dataIndex == index){
                    item.hide();
                    this.syncSize();
                    return false;
                }
            },this);
        },

        // private
        addActionsButtons : function() {
            var tb = this.getBottomToolbar() || this.getTopToolbar() || this;
            tb.addButton( {
                iconCls : 'rs-action-condition',
                text : '条件',
                scope : this,
                menu : this.addConditonMenu = new Ext.menu.Menu()
            });
            tb.addButton({
                iconCls : 'rs-action-reset',
                text : '重置',
                handler : this.resetConditions,
                scope : this
            });
            tb.addButton( {
                iconCls : 'rs-action-query',
                text : '查询',
                handler : this.doQuery,
                scope : this
            });
        },

        // private
        addConditionToMenu : function(condition, checked) {
            if(!condition){
                return;
            }
            var item = this.addConditonMenu.add({
                text : condition.header || condition.dataIndex,
                dataIndex : condition.dataIndex,
                condition : condition,
                checked : checked,
                hideOnClick : false,
                handler : this.onConditionMenuClick,
                scope : this
            });
        },

        onConditionMenuClick : function(item, e){
            if(item.checked){
                this.removeConditionFromPanel(item.dataIndex);
                this.fireEvent('unselectcondition', this ,item );
            } else{
                this.addConditionToPanel(item.condition);
                this.fireEvent('selectcondition', this ,item);
            }
        },

        // private
        resetConditions : function() {
            this.items.each(function(item) {
                item.items.items[0].reset();
            }, this);
            /*
            if(this.store){
                this.store.load();
            }
            */
            this.fireEvent('reset', this);
        },
        
        //override
		initEvents : function() {
			Rs.ext.query.QueryPanel.superclass.initEvents.call(this);
			this.keyNav = new Ext.KeyNav(this.el, 
				Ext.apply(this.keyNavConfig, {
					scope : this,
					forceKeyDown : true
				})
			);
		},

        /**
         * <p>绑定到Store.用户表格等使用Store的控件查询</p>
         * @param {Store} store
         */
        bindStore : function(store, queryCallback, queryScope) {
            this.store = store;
            this.queryCallback = queryCallback;
            this.queryScope = queryScope;
        },

        /**
         * <p>绑定到节点.用于树的查询</p>
         * @param {Node} node
         */
        bindNode : function(node) {
            this.node = node;
        },
        
        /**
         * <p>绑定到GeneralselPanel.用于GeneralselPanel的查询</p>
         * @param {GeneralselPanel} panel
         */
        bindGeneralselPanel : function(panel) {
            this.gPanel = panel;
        },

        /**
         * <p>获取查询条件</p>
         * @return {Object} params
         */
        getParams : function() {
            var params = {};
            this.items.each(function(item){
                if(!item.hidden){ //如果是隐藏的条件则不读取他的值
                    var v = item.items.items[0].getValue() ;
                        if(!Ext.isEmpty(v)){
                        params[item.dataIndex] = v;
                    }
                }
            },this) ;
            return params;
        },

        /**
         * <p>执行查询</p>
         */
        doQuery : function() {
            if(!this.preDoQuery()) {
                return;
            }
            var params = this.getParams();
            if(params && this.fireEvent("beforequery", this, params) !== false) {
                if(this.store) {
                    if(this.queryCallback){
                        var param = this.getSQL(params);
                        this.queryCallback.call(this.queryScope, param);
                    } else{
                        Ext.applyIf(params, this.store.baseParams || this.grid.store.baseParams || {});
                        this.store.load( { 
                            params : params
                        });
                    }
                } else if(this.grid && this.grid.store){
                    if(this.queryCallback){
                        var param = this.getSQL(params);
                        this.queryCallback.call(this.queryScope, param);
                    } else{
                        Ext.applyIf(params, this.grid.store.baseParams || {});
                        params.metaData.start = 0 ;
                        this.grid.store.load( { 
                            params : params
                        });
                    }
                }  else if(this.node) {
                    //删除上次查询时给绑定的节点添加的baseParams参数
                    if(this.nodeBaseParams) {
                        var p = this.nodeBaseParams, 
                            l = this.node.getLoader().baseParams,
                            i;
                        for(i in p) {
                            l[i] ? delete l[i] : null;
                        }
                    }
                    this.node.collapse(true);
                    while (this.node.firstChild) {
                        this.node.removeChild(this.node.firstChild, true);
                        var a = this ;
                    }
                    this.node.loaded = false;
                    this.node.loading = -1;
                    
                    //将查询条件添加到node的baseParams中
                    Ext.apply(this.node.getLoader().baseParams, params);
                    this.node.expand(false, false);
                    
                    //将此次查询的查询条件记录在nodeBaseParams中
                    this.nodeBaseParams = params;
                } 
                this.fireEvent("query", this, params);
            }
        },
        
        /**
         * <p>获取sql查询条件</p>
         * @param {Object} params
         * @return {String} 
         */
        getSQL : function(params){
            var condition = [];
            for(var p in params){
                condition.push(p + " like '" + params[p] + "%'");
            }
            return condition.join(' AND ');
        },
        
        // private
        preDoQuery : function() {
            var v = true;
            this.items.each(function(item) {
                return v = item.items.items[0].validate();
            }, this);
            return v;
        },

        // private
        applyState : function(state) {
            if(state && state.conditions) {
                this.resetConditions();//需要先将上一个方案的条件去掉
                this.addConditonMenu.items.each(function(item){
                    if(state.conditions[item.dataIndex]!==undefined){ 
                        item.setChecked(true);
                        this.addConditionToPanel(item.condition);
                    }else{
                        item.setChecked(false);
                        this.removeConditionFromPanel(item.dataIndex);
                    }
                },this);
                this.setValue(state.conditions); //lulu 0627
            }
        },

        setValue : function(vobject){
            for(var p in vobject){
                this.findById(this.editors[p]).setValue(vobject[p]);
            }
        },

        // private
        getState : function() {
            var o = { 
                    conditions : {}
                }, 
                i = 0;
            this.addConditonMenu.items.each(function(item){
                if(item.checked){
                    o.conditions[item.dataIndex] = this.findById(this.editors[item.dataIndex]).getValue();
                }
            },this);
            return o; 
        },

        // private override
        destroy : function() {
            Rs.ext.query.QueryPanel.superclass.destroy.apply(this, arguments);
            //this.queryConditionModel.destroy();
        }
        
    });
    
    Ext.ComponentMgr.registerType("rs-ext-querypanel", Rs.ext.query.QueryPanel);
})();