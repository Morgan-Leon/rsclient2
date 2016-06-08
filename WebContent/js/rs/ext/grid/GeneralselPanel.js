Ext.ns("Rs.ext.grid");

(function(){
    //查询面板
    var QueryPanel = function(config){
        config = config || {};
        var region = config.region;
        if(region == 'west' || region == 'east'){
            Ext.apply(config, {
                width : 129,
                autoWidth : false,
                autoHeight : false
            });
        }else {
            Ext.apply(config, {
                autoWidth : false,
                autoHeight : true
            });
        }
        QueryPanel.superclass.constructor.call(this, Ext.applyIf(config, {
            collapsible : true,
            collapsed : true,
            hideCollapseTool : true,
            collapseMode : "mini",
            split : true
        }));
        this.on('beforeexpand', function(){
            return this.configDisabled != true;
        }, this);
        this.on('render', function(){
            if(this.configCollapsed === false  
                && this.loadFields === true){
                this.expand();
            }
            if(this.configDisabled == true){
                this.setDisabled(true);
            }
        }, this, {
            scope : this, 
            delay : 10,
            single : true
        });
		
		this.on('resize', function(){
            if(this.ownerCt){
                this.ownerCt.doLayout();
            }
        },this, {delay: 10});
		
    };
    
    Ext.extend(QueryPanel, Ext.Panel, {

        bodyStyle : 'padding:5px;',

        autoScroll : true,
        
        defaults : {
            border : false
        },
        
        animCollapse : false,
        
        configCollapsed : true,
        
        layout : 'column',
        
		bbar : ['->',{
            iconCls : 'rs-action-query' ,
            text : '查询',
            handler : function(){
                this.ownerCt.ownerCt.doQuery();
            }
        },{xtype: 'tbspacer'},{xtype: 'tbspacer'},{
            iconCls : 'rs-action-reset' ,
            text : '重置',
            handler : function(){
                this.ownerCt.ownerCt.doReset();
            }
        }] ,
		
        reconfigure : function(generalselPanel, conditions){
            this.loadFields = false;
            this.generalselPanel = generalselPanel;
            var fields = [], 
                conditionFields = [];
            for(var i = 0, l = conditions.length; i < l; i++){
                if(!this.displayQueryField){
                    var field = Ext.create(Ext.apply(conditions[i], {
                        width : 125 ,
                        style : {
                            marginRight : '4px' ,
                            marginBottom : '2px'
                        }
                    }), 'textfield'); 
                    fields.push({
                        bodyStyle:"background:transparent;padding:3px 1px 1px 3px",
                        width : 132,
                        items : field
                    });
                    conditionFields.push(field);
                } else {
                    if(this.displayQueryField.indexOf(conditions[i]['dataIndex']) > -1 ){
                        var field = Ext.create(Ext.apply(conditions[i], {
                            width : 125 ,
                            style : {
                                marginRight : '4px' ,
                                marginBottom : '2px'
                            }
                        }), 'textfield'); 
                        fields.push({
                            bodyStyle:"background:transparent;padding:3px 1px 1px 3px",
                            width : 132,
                            items : field
                        });
                        conditionFields.push(field);
                    }
                }
            }
            this.removeFields();
            this.oldConditionFields = this.add(fields);
            this.conditionFields = conditionFields;
            this.loadFields = true;
            if(this.configCollapsed === false 
                && this.rendered === true){
                this.expand();
            }
			this.fireEvent('resize');
        },
        
        //private
        removeFields : function(){
            var ofs = this.oldConditionFields || [];
            for(var i = 0, l = ofs.length; i < l; i++){
                this.remove(ofs[i], true);
            }
            delete this.oldConditionFields;
        },
        
        //private
        doQuery : function(){
            var cfs = this.conditionFields || [],
                condition = [];
            for(var i = 0, l = cfs.length; i < l; i++){
                var cf = cfs[i],
                    field = cf.dataIndex,
                    value = cf.getValue();
                if(field != undefined && field.trim() != ""
                    && value != undefined && value.trim() != ""){
                    condition.push(field + " like '" + value + "%'");
                }
            }
            progCondtion = this.buildProgCondtion(condition.join(' AND '));
            this.generalselPanel.query(progCondtion);
        },
        
		buildProgCondtion : function(progCondition){
            return progCondition;
        },
		
        //private
        doReset : function(){
            var cfs = this.conditionFields || [];
            for(var i = 0, l = cfs.length; i < l; i++){
                var cf = cfs[i];
                cf.reset();
            }
        }, 
        
        //
        setDisabled : function(disable){
            QueryPanel.superclass.setDisabled.apply(this, arguments);
            this.configDisabled = disable;
            if(disable == true) {
                (this.collapsed != true)?this.collapse():null;
            }else {
                (this.collapsed && this.rendered) ? this.expand():null;
            }
        },
        
        //private
        onDestroy : function(){
            QueryPanel.superclass.onDestroy.apply(this, arguments);
            this.removeFields();
        }
    
    });
    
    /**
     * @class Rs.ext.grid.GeneralselPanel 
     * @extends Ext.Panel
     * <pre><code>
var p1 = new Rs.ext.grid.GeneralselPanel( {
    progCode :  'SelFixValueChange',
    progCondition : ' company_code = \'00\'',
    pageSize : false, //不进行分页
    queryPanelCollapsed : false,  //查询面板自动展开
    gridConfig : {
         sm : new Ext.grid.CheckboxSelectionModel() //设置selection model
    }
});
     * </code></pre>
     */
    Rs.ext.grid.GeneralselPanel = function(config){
        config = config  || {};
        
        var progCode = config.progCode,
            progCondition = config.progCondition ,
			displayQueryField = config.displayQueryField,
			dataCompany = config.dataCompany ;

        this.store = new Rs.ext.data.GeneralselStore({
            autoLoad : false,
            autoDestroy: true,
            progCode : progCode,
            progCondition : progCondition,
            dataCompany: dataCompany
        });
        
        var gridConfig = config.gridConfig || {},
            columns = gridConfig.columns || [];
        
        //分页
        var pageSize = config.pageSize;
        if(pageSize !== false){
            pageSize = Ext.isNumber(pageSize)?pageSize:20;
            this.pagingToolbar = new Rs.ext.grid.SliderPagingToolbar({
                pageSize : pageSize,
                border : true,
                store : this.store,
                hasSlider : false,
                displayInfo : false
            });
            Ext.apply(config, {
                keys : [{
                    key: 36, //home
                    fn: function(){
                        var data = this.pagingToolbar.getPageData();
                        if(data && data.activePage > 1){
                            this.pagingToolbar.moveFirst();
                        }
                    },
                    scope: this
                }, {
                    key: 35, //end
                    fn: function(){
                        var data = this.pagingToolbar.getPageData();
                        if(data && data.activePage < data.pages){
                            this.pagingToolbar.moveLast();
                        }
                    },
                    scope: this
                }, {
                    key: 33, //page up
                    fn: function(){
                        var sd = this.grid.getView().scroller.dom;
                        if(sd.scrollTop <= 0){
                            var data = this.pagingToolbar.getPageData();
                            if(data && data.activePage > 1){
                                this.pagingToolbar.movePrevious();
                                sd.scrollTop = sd.scrollHeight - sd.clientHeight;
                            }
                        }
                    },
                    scope: this
                }, {
                    key: 34, //page down
                    fn: function(){
                        var sd = this.grid.getView().scroller.dom;
                        if(sd.clientHeight + sd.scrollTop >= sd.scrollHeight){
                            var data = this.pagingToolbar.getPageData();
                            if(data && data.activePage < data.pages){
                                this.pagingToolbar.moveNext();
                            }
                        }
                    },
                    scope: this
                }]
            });
            Ext.apply(config, {
                bbar : this.pagingToolbar
            });
        }
        
        //数据表格
        this.grid = new Rs.ext.grid.GeneralselGridPanel(Ext.apply(gridConfig, {
            store : this.store,
            columns : columns,
            deferRowRender : false,
            enableHdMenu : false,
            loadMask : true,
            region: 'center'
        }));
        
        //查询面板
        var qpcfg = config.queryPanelConfig || {}, 
            qpc = config.queryPanelCollapsed,
            qpp = config.queryPanelPosition,
            qpd = config.queryPanelDisable ;
			
		if(config.buildProgCondtion){
            buildProgCondtion = config.buildProgCondtion
        }	
        
        if(config.queryPanel){
            this.queryPanel = config.queryPanel;
            this.queryPanel.bindStore(this.store, this.query, this);
            this.queryPanel.on('selectcondition', this.onQueryPanelChange, this);
            this.queryPanel.on('unselectcondition', this.onQueryPanelChange, this);
        } else{
            if(config.buildProgCondtion){
                this.queryPanel = new QueryPanel(Ext.apply(qpcfg, {
                    region :  qpp || 'north',
                    configCollapsed : Ext.isBoolean(qpc) ? qpc : true,
                    configDisabled : Ext.isBoolean(qpd) ? qpd : false ,
                    buildProgCondtion : buildProgCondtion
                }));
            } else {
                this.queryPanel = new QueryPanel(Ext.apply(qpcfg, {
                    region :  qpp || 'north',
                    configCollapsed : Ext.isBoolean(qpc) ? qpc : true,
                    configDisabled : Ext.isBoolean(qpd) ? qpd : false
                }));
            }
            this.buildinPanel = true;
        }
        
        delete config.progCode;
        delete config.dataCompany;
        delete config.progCondition;
		delete config.displayQueryField;
        delete config.gridConfig;
        delete config.queryPanelCollapsed;
        delete config.queryPanelPosition;
        delete config.buildProgCondtion;

        /*this.queryPanel.on('resize', function(){
            this.layout.layout();
        },this, {delay: 10});*/
        
        Rs.ext.grid.GeneralselPanel.superclass.constructor.call(this, Ext.apply(config, {
            layout: 'border'
        }));
        
        //自动加载数据
        if(this.storeAutoLoad == true){
            this.store.load();
        }
        //监听store事件
        this.store.on('metachange', this.onStoreMeataChange, this);
        this.store.on("loadexception", this.onLoadException, this);
    };
    
    Ext.extend(Rs.ext.grid.GeneralselPanel, Ext.Panel, {
        
        /**
         * @cfg {String} progCode 望远镜编码
         */
        
        /**
         * @cfg {String} progCondition 望远镜条件
         */
		
        /**
         * @cfg {Object} queryPanelConfig 查询面板属性配置
         */
        
        /**
         * @cfg {Object} gridConfig 表格属性配置
         */
        
        /**
         * @cfg {Boolean} storeAutoLoad 是否自动加载数据, 默认为true
         */
        storeAutoLoad : true,
        
        /**
         * @cfg {Boolean/Number} pageSize 每页显示条数,如果为false表示不进行分页,
         * 默认进行分页，且分页条数为20
         */
        
        /**
         * 
         * @cfg {String} queryPanelPosition 查询面板位置, 默认位置为 north 
         * 可设置的位置有如下：west east north south
         */
        
        /**
         * @cfg {Boolean} queryPanelCollapsed 查询面板是否展开, 默认为不展开 true
         */
        
        /**
         * @cfg {Boolean} queryPanelDisable 查询面板可用, 默认是可用 false
         */
        queryPanelDisable : false,
        
        //private override
        initComponent : function(){
            Rs.ext.grid.GeneralselPanel.superclass.initComponent.apply(this, arguments);
            this.add(this.queryPanel);
            this.add(this.grid);
        }, 
        
        /**
         * 设置查询面板可用/不可用.
         * Convenience function for setting disabled/enabled by boolean
         * @param {Boolean} disable
         */
        setQueryPanelDisable : function(disable){
        	if(this.queryPanelDisable != disable){
                this.queryPanelDisable = disable;
                this.queryPanel && this.queryPanel.setDisabled(disable == true);
            }
        },
        
        onQueryPanelChange : function(){
            this.doLayout();
        },
        /**
         * 获取store
         * @return {Mixed store}
         */
        getStore : function(){
            return this.store;
        },
        
        /**
         * 获取表格
         * @return {Grid} 
         */
        getGrid : function(){
            return this.grid;
        },
        
        /**
         * 获取分页控件
         * @return {Toolbar} 
         */
        getPagingToolbar : function(){
            return this.pagingToolbar;
        },
        
        //private
        onStoreMeataChange : function(store, meta){
            var conditions = [],
                fields, i, l, 
                field,
                header;
            if(this.queryPanel && (fields = meta ? meta.queryFields : undefined)){
                for(i = 0, l = fields.length; i < l; i++){
                    field = fields[i];
                    header = field.descCh || field.descEn || field.name;
                    conditions.push({
                        dataIndex : field.name,
                        allowBlank : field.allowBlank,
                        emptyText : header,
                        blankText : header + '不能为空'
                    });
                }
                if(conditions.length > 0){
                    if(this.buildinPanel === true){
                        this.queryPanel.reconfigure(this, conditions);
                    }
                }
            }
        },
        
        //private
        onLoadException : function(proxy, options, response, e){
            //TODO : 提示异常信息
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
            var ptb = this.getPagingToolbar();
            if(ptb != undefined){
                ptb.setStart(0);
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
        
        //private
        onDestroy : function(){
            Rs.ext.grid.GeneralselPanel.superclass.onDestroy.apply(this, arguments);
            if(this.store){
                this.store.un('metachange', this.onStoreMeataChange, this);
                this.store.un('load', this.onLoadSelectFirstRow, this);
                this.store.un("loadexception", this.onLoadException, this);
                this.store.destroy();
            }
            if(this.grid){
                this.grid.destroy();
            }
            if(this.pagingToolbar){
                this.pagingToolbar.destroy();
            }
            if(this.queryPanel){
                this.queryPanel.destroy();
            }
        } ,
        
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
    
    Ext.ComponentMgr.registerType("rs-ext-generalselpanel", Rs.ext.grid.GeneralselPanel);
})();