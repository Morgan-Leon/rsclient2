Rs.define('rs.pub.GeneralFormActionsPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        
        var grid = this.grid = this.getGrid({
            margins : '5 5 1 5',
            region : 'center'
        });
        
        var editor = this.editorPanel = this.getEditorPanel({
            margins : '1 5 5 5',
            region : 'south',
            height : 310,
            minHeight : 310,
            maxHeight : 500,
            collapsed : true,
            collapsible : false,
            animCollapse : false,
            split : true,
            border : true,
            collapseMode : "mini"
        });
        
        Ext.apply(config, {
            layout : 'border',
            border : false,
            tbar : [{
                text : '新增',
                tooltip : '新增一个业务操作按钮',
                iconCls : 'rs-action-create',
                scope: this,
                handler : this.createFormAction
            }],
            items : [grid, editor]
        });
        rs.pub.GeneralFormActionsPanel.superclass.constructor.apply(this, arguments);
    },
    
    getGrid : function(config){
        
        var store = new Rs.ext.data.Store({
            autoLoad : false,
            autoDestroy: true,
            url: GENERALFORM_DATASERVICE,
            root: 'action',
            readMethod : 'getFormActions',
            idProperty: 'actionNo',
            fields: ['formCode', 'actionNo', 'actionName', 'actionType', 
                     'iconCls', 'tooltip', 'execDML', 'callSP', 'callback', 'disabledExpression'],
            baseParams : {}
        });
        config = Rs.apply(config || {}, {
            store : store,
            columns : [{
                xtype : 'actioncolumn',
                width : 100,
                header : '操作',
                align : 'center',
                menuDisabled : true,
                items : [{
                    iconCls : 'generalform-formheader-icon',
                    tooltip: '编辑该操作',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showFormActionPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'rs-action-delete',
                    tooltip: '删除该操作',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delFormAction(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header   : '编号', 
                width    : 50,
                sortable : false,
                align : 'center',
                dataIndex: 'actionNo'
            }, {
                header : '操作名称',
                width : 100,
                sortable : false,
                dataIndex : 'actionName'
            }, {
                header : '操作类型',
                width : 100,
                sortable : false,
                dataIndex : 'actionType'
            }, {
                header : '图标',
                width : 60,
                sortable : false,
                dataIndex : 'iconCls',
                align : 'center',
                renderer : function(v){
                    return '<span class=' + v 
                    + '>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
                }
            }, {
                header : '操作说明',
                width : 100,
                sortable : false,
                dataIndex : 'tooltip'
            }, {
                header : 'DML',
                width : 200,
                sortable : false,
                dataIndex : 'execDML'
            }, {
                header : 'SP',
                width : 200,
                sortable : false,
                dataIndex : 'callSP'
            }, {
                header : '禁用表达式',
                width : 200,
                sortable : false,
                dataIndex : 'disabledExpression'
            }]
        });
        return new Ext.grid.GridPanel(config);
    }, 
    
    getEditorPanel : function(config){
        Ext.apply(config, {
            formBody : {
                fieldLabelWidth : 67,
                fields : [[{
                    xtype : 'numberfield',
                    dataIndex : 'actionNo',
                    allowBlank : false,
                    fieldLabel : '操作编码',
                    columnWidth: 0.3
                }, {
                    dataIndex : 'actionName',
                    allowBlank : false,
                    fieldLabel : '操作名称',
                    maxLength : 30,
                    columnWidth: 0.3
                }, {
                    xtype : 'combo',
                    dataIndex : 'actionType',
                    allowBlank : false,
                    fieldLabel : '操作类型',
                    triggerAction : 'all',
                    editable : false,
                    lazyRender : true,
                    mode : 'local',
                    valueField: 'key',
                    displayField: 'value',
                    store : new Ext.data.ArrayStore({
                        fields : ['key', 'value'],
                        data : [['save', '保存'], ['clear', '删除'],
                                ['load', '刷新'], ['exec', '执行数据库操作'],
                                ['javascript', '执行脚本']]
                    }),
                    columnWidth: 0.4
                }], [{
                    xtype : 'combo',
                    dataIndex : 'iconCls',
                    allowBlank : false,
                    fieldLabel : '图标',
                    triggerAction : 'all',
                    editable : false,
                    lazyRender : true,
                    mode : 'local',
                    valueField: 'key',
                    displayField: 'value',
                    store : new Ext.data.ArrayStore({
                        fields : ['key', 'value'],
                        data : [['rs-action-save', '保存'],
                                ['rs-action-remove', '删除'],
                                ['rs-action-modify', '修改'],
                                ['rs-action-clear', '清除'],
                                ['rs-action-cancel', '取消'],
                                ['rs-action-submit', '提交'],
                                ['rs-action-settings', '设置'],
                                ['rs-action-attribute', '属性'],
                                ['rs-action-power', '权限'],
                                ['rs-action-reset', '重置'],
                                ['rs-action-ok', '确定'],
                                ['rs-action-export', '导出Execl'],
                                ['rs-action-reject', '驳回'],
                                ['rs-action-audit', '审核'],
                                ['rs-action-seniorquery', '高级查询'],
                                ['rs-action-savedraft', '草稿箱'],
                                ['rs-action-bacthgoleft', '批量向左'],
                                ['rs-action-bacthgoright', '批量向右'],
                                ['rs-action-goleft', '向左'],
                                ['rs-action-goright', '向右'],
                                ['rs-action-carryover', '结转'],
                                ['rs-action-submit', '提交'],
                                ['rs-action-reject', '驳回'],
                                ['s-action-editfind', '查阅情况'],
                                ['rs-action-stop', '终止'],
                                ['rs-action-colse', '关闭'],
                                ['rs-action-favorite', '收藏'],
                                ['rs-action-loseeffect', '失效'],
                                ['rs-action-effect', '生效'],
                                ['rs-action-goback', '返回'],
                                ['rs-action-create', '新建'],
                                ['rs-action-batchdelete', '删除(批量)'],
                                ['rs-action-delete', '删除(逐条)'],
                                ['rs-action-unread', '未读'],
                                ['rs-action-read', '已读'],
                                ['rs-action-detail', '详细'],
                                ['rs-action-rename', '重命名'],
                                ['rs-action-query', '查询'],
                                ['rs-action-querypanel', '查询面板'],
                                ['rs-action-apply', '应用'],
                                ['rs-action-exception', '异常'],
                                ['rs-action-help', '帮助'],
                                ['rs-action-download-enable', '下载']]
                    }),
                    columnWidth: 0.3
                }, {
                    dataIndex : 'tooltip',
                    allowBlank : true,
                    fieldLabel : '操作说明',
                    maxLength : 100,
                    columnWidth: 0.3
                }, {
                    dataIndex : 'disabledExpression',
                    allowBlank : true,
                    fieldLabel : '禁用表达式',
                    maskRe : '',
                    maxLength : 500,
                    columnWidth: 0.4
                }], [{
                    dataIndex : 'execDML',
                    allowBlank : true,
                    fieldLabel : 'DML',
                    maxLength : 300,
                    columnWidth: 1
                }], [{
                    dataIndex : 'callSP',
                    allowBlank : true,
                    fieldLabel : 'SP',
                    maxLength : 300,
                    columnWidth: 1
                }], [{
                    xtype : 'textarea',
                    dataIndex : 'callback',
                    allowBlank : true,
                    fieldLabel : '回调脚本',
                    maxLength : 500,
                    height : 80,
                    maskRe : '',
                    columnWidth: 1
                }]]
            },
            formFooter : {
                left : {
                    fontSize : 10,
                    color : 'red',
                    fieldLabel : '注',
                    value : '回调脚本为javascript脚本, 内置变量:cardPanel-卡片面板, container-数据模型容器, model-当前数据模型, result-响应结果'
                        + ' 内置函数:action(actionNo, callback)-执行操作actionNo为操作编号, save(callback)-保存, clear(callback)-删除, load(callback)-加载'
                }
            },
            tbar : [{
                text : '保存',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.saveFormAction                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            }
            /*
            , '->', {
                text : '帮助',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.showHelpPanel
            }
            */
            ]
        });
        
        return new Rs.ext.app.CardPanel(config);
    }, 
    
    setGeneralHead : function(generalHead){
        this.generalHead = generalHead;
        var store = this.grid.getStore();
        store.baseParams['formCode'] = generalHead.get('formCode');
        store.load();
    },
    
    createFormAction : function(){
        this.editorPanel.collapsed ? this.editorPanel.expand():null;
        var head = this.generalHead;
        var column = new Rs.ext.app.Model({
            url: GENERALFORM_DATASERVICE,
            saveMethod : 'createFormAction',
            data : {
                formCode : head.get('formCode'),
                actionType : 'save',
                iconCls : 'rs-action-save'
            }
        });
        this.editorPanel.setModel(column);
        this.editorPanel.setFieldReadOnly('actionNo', false);
    }, 
    
    saveFormAction : function(){
        if(this.editorPanel.fieldValidate() == true){
            var model = this.editorPanel.getModel();
            Ext.Msg.wait('正在保存...', '提示');
            model.save(function(result){
                Ext.Msg.hide();
                if(result != true){
                    Ext.Msg.alert('提示', result);
                }
                this.grid.getStore().reload();
            }, this);
        }
    }, 
    
    showFormActionPanel : function(actionData){
        this.editorPanel.collapsed ? this.editorPanel.expand():null;
        var model = new Rs.ext.app.Model({
            url: GENERALFORM_DATASERVICE,
            saveMethod : 'saveFormAction',
            data : actionData
        });
        this.editorPanel.setModel(model);
        this.editorPanel.setFieldReadOnly('actionNo', true);
    }, 
    
    showHelpPanel : function(){
        var helpWindow = this.helpWindow;
        if(!helpWindow){
            helpWindow = this.helpWindow = new Ext.Window({
                title : '通用表单页业务操作',
                width : 400,
                height : 300,
                layout : 'fit',
                modal : false,
                closable : false,
                resizable : true,
                items : [{
                    html : ''
                }],
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.helpWindow.hide();
                    }
                }]
            });
        }
        this.helpWindow.show();
    }, 
    
    delFormAction : function(actionData){
        this.editorPanel.collapsed?null:this.editorPanel.collapse();
        Ext.MessageBox.show({
            title:'提示',
            msg: '您确定要删除该业务操作吗？删除后将无法恢复',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = new Rs.ext.app.Model({
                        url: GENERALFORM_DATASERVICE,
                        clearMethod : 'clearFormAction',
                        data : actionData
                    });
                    Ext.Msg.wait('正在删除...', '提示');
                    model.clear(function(result){
                        Ext.Msg.hide();
                        if(result != true){
                            Ext.Msg.alert('提示', result);
                        }
                        this.grid.getStore().reload();
                    }, this);
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    }
    
});