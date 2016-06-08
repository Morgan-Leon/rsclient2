Ext.ns("Rs.ext.query");

(function() {
    /**
     * @class Rs.ext.query.QueryPanel <p>��ѯ���</p>
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
         * <p>ɾ��ĳ����ѯ�����󣬴������¼�</p>
         * @param {Rs.ext.qeury.Conditon} conditon
         * @param {Object} filter
         */
        'unselectcondition',
        /**
         * @event beforequery 
         * <p>��ѯ֮ǰִ�д������¼�������������¼��Ļص���������false ����ֹ�ò���</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         * @param {Object} params 
         */
        'beforequery',
        /**
         * @event query 
         * <p>��ѯ</p>
         * @param {Rs.ext.query.QueryPanel} queryPanel
         * @param {Object} params
         */
        'query',
        /**
         * @event reset 
         * <p>����</p>
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
         * �Ƿ�Ϊ����ʽ, Ĭ��Ϊfalse
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
         * ������ Ĭ��230 ���û�г���������ֹ������е����⣬�벻Ҫ�޸�
         */
        widgetWidth : 230 ,
        
        /**
         * @cfg {Number} labelWidth
         * ���label��� Ĭ��100 ���û�г���������ֹ������е����⣬�벻Ҫ�޸�
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
                text : '����',
                scope : this,
                menu : this.addConditonMenu = new Ext.menu.Menu()
            });
            tb.addButton({
                iconCls : 'rs-action-reset',
                text : '����',
                handler : this.resetConditions,
                scope : this
            });
            tb.addButton( {
                iconCls : 'rs-action-query',
                text : '��ѯ',
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
         * <p>�󶨵�Store.�û�����ʹ��Store�Ŀؼ���ѯ</p>
         * @param {Store} store
         */
        bindStore : function(store, queryCallback, queryScope) {
            this.store = store;
            this.queryCallback = queryCallback;
            this.queryScope = queryScope;
        },

        /**
         * <p>�󶨵��ڵ�.�������Ĳ�ѯ</p>
         * @param {Node} node
         */
        bindNode : function(node) {
            this.node = node;
        },
        
        /**
         * <p>�󶨵�GeneralselPanel.����GeneralselPanel�Ĳ�ѯ</p>
         * @param {GeneralselPanel} panel
         */
        bindGeneralselPanel : function(panel) {
            this.gPanel = panel;
        },

        /**
         * <p>��ȡ��ѯ����</p>
         * @return {Object} params
         */
        getParams : function() {
            var params = {};
            this.items.each(function(item){
                if(!item.hidden){ //��������ص������򲻶�ȡ����ֵ
                    var v = item.items.items[0].getValue() ;
                        if(!Ext.isEmpty(v)){
                        params[item.dataIndex] = v;
                    }
                }
            },this) ;
            return params;
        },

        /**
         * <p>ִ�в�ѯ</p>
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
                    //ɾ���ϴβ�ѯʱ���󶨵Ľڵ���ӵ�baseParams����
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
                    
                    //����ѯ������ӵ�node��baseParams��
                    Ext.apply(this.node.getLoader().baseParams, params);
                    this.node.expand(false, false);
                    
                    //���˴β�ѯ�Ĳ�ѯ������¼��nodeBaseParams��
                    this.nodeBaseParams = params;
                } 
                this.fireEvent("query", this, params);
            }
        },
        
        /**
         * <p>��ȡsql��ѯ����</p>
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
                this.resetConditions();//��Ҫ�Ƚ���һ������������ȥ��
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