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
                text : '����',
                tooltip : '����һ��ҵ�������ť',
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
                header : '����',
                align : 'center',
                menuDisabled : true,
                items : [{
                    iconCls : 'generalform-formheader-icon',
                    tooltip: '�༭�ò���',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showFormActionPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'rs-action-delete',
                    tooltip: 'ɾ���ò���',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delFormAction(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header   : '���', 
                width    : 50,
                sortable : false,
                align : 'center',
                dataIndex: 'actionNo'
            }, {
                header : '��������',
                width : 100,
                sortable : false,
                dataIndex : 'actionName'
            }, {
                header : '��������',
                width : 100,
                sortable : false,
                dataIndex : 'actionType'
            }, {
                header : 'ͼ��',
                width : 60,
                sortable : false,
                dataIndex : 'iconCls',
                align : 'center',
                renderer : function(v){
                    return '<span class=' + v 
                    + '>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>';
                }
            }, {
                header : '����˵��',
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
                header : '���ñ��ʽ',
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
                    fieldLabel : '��������',
                    columnWidth: 0.3
                }, {
                    dataIndex : 'actionName',
                    allowBlank : false,
                    fieldLabel : '��������',
                    maxLength : 30,
                    columnWidth: 0.3
                }, {
                    xtype : 'combo',
                    dataIndex : 'actionType',
                    allowBlank : false,
                    fieldLabel : '��������',
                    triggerAction : 'all',
                    editable : false,
                    lazyRender : true,
                    mode : 'local',
                    valueField: 'key',
                    displayField: 'value',
                    store : new Ext.data.ArrayStore({
                        fields : ['key', 'value'],
                        data : [['save', '����'], ['clear', 'ɾ��'],
                                ['load', 'ˢ��'], ['exec', 'ִ�����ݿ����'],
                                ['javascript', 'ִ�нű�']]
                    }),
                    columnWidth: 0.4
                }], [{
                    xtype : 'combo',
                    dataIndex : 'iconCls',
                    allowBlank : false,
                    fieldLabel : 'ͼ��',
                    triggerAction : 'all',
                    editable : false,
                    lazyRender : true,
                    mode : 'local',
                    valueField: 'key',
                    displayField: 'value',
                    store : new Ext.data.ArrayStore({
                        fields : ['key', 'value'],
                        data : [['rs-action-save', '����'],
                                ['rs-action-remove', 'ɾ��'],
                                ['rs-action-modify', '�޸�'],
                                ['rs-action-clear', '���'],
                                ['rs-action-cancel', 'ȡ��'],
                                ['rs-action-submit', '�ύ'],
                                ['rs-action-settings', '����'],
                                ['rs-action-attribute', '����'],
                                ['rs-action-power', 'Ȩ��'],
                                ['rs-action-reset', '����'],
                                ['rs-action-ok', 'ȷ��'],
                                ['rs-action-export', '����Execl'],
                                ['rs-action-reject', '����'],
                                ['rs-action-audit', '���'],
                                ['rs-action-seniorquery', '�߼���ѯ'],
                                ['rs-action-savedraft', '�ݸ���'],
                                ['rs-action-bacthgoleft', '��������'],
                                ['rs-action-bacthgoright', '��������'],
                                ['rs-action-goleft', '����'],
                                ['rs-action-goright', '����'],
                                ['rs-action-carryover', '��ת'],
                                ['rs-action-submit', '�ύ'],
                                ['rs-action-reject', '����'],
                                ['s-action-editfind', '�������'],
                                ['rs-action-stop', '��ֹ'],
                                ['rs-action-colse', '�ر�'],
                                ['rs-action-favorite', '�ղ�'],
                                ['rs-action-loseeffect', 'ʧЧ'],
                                ['rs-action-effect', '��Ч'],
                                ['rs-action-goback', '����'],
                                ['rs-action-create', '�½�'],
                                ['rs-action-batchdelete', 'ɾ��(����)'],
                                ['rs-action-delete', 'ɾ��(����)'],
                                ['rs-action-unread', 'δ��'],
                                ['rs-action-read', '�Ѷ�'],
                                ['rs-action-detail', '��ϸ'],
                                ['rs-action-rename', '������'],
                                ['rs-action-query', '��ѯ'],
                                ['rs-action-querypanel', '��ѯ���'],
                                ['rs-action-apply', 'Ӧ��'],
                                ['rs-action-exception', '�쳣'],
                                ['rs-action-help', '����'],
                                ['rs-action-download-enable', '����']]
                    }),
                    columnWidth: 0.3
                }, {
                    dataIndex : 'tooltip',
                    allowBlank : true,
                    fieldLabel : '����˵��',
                    maxLength : 100,
                    columnWidth: 0.3
                }, {
                    dataIndex : 'disabledExpression',
                    allowBlank : true,
                    fieldLabel : '���ñ��ʽ',
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
                    fieldLabel : '�ص��ű�',
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
                    fieldLabel : 'ע',
                    value : '�ص��ű�Ϊjavascript�ű�, ���ñ���:cardPanel-��Ƭ���, container-����ģ������, model-��ǰ����ģ��, result-��Ӧ���'
                        + ' ���ú���:action(actionNo, callback)-ִ�в���actionNoΪ�������, save(callback)-����, clear(callback)-ɾ��, load(callback)-����'
                }
            },
            tbar : [{
                text : '����',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.saveFormAction                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            }
            /*
            , '->', {
                text : '����',
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
            Ext.Msg.wait('���ڱ���...', '��ʾ');
            model.save(function(result){
                Ext.Msg.hide();
                if(result != true){
                    Ext.Msg.alert('��ʾ', result);
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
                title : 'ͨ�ñ�ҳҵ�����',
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
                    text : '�ر�',
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
            title:'��ʾ',
            msg: '��ȷ��Ҫɾ����ҵ�������ɾ�����޷��ָ�',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = new Rs.ext.app.Model({
                        url: GENERALFORM_DATASERVICE,
                        clearMethod : 'clearFormAction',
                        data : actionData
                    });
                    Ext.Msg.wait('����ɾ��...', '��ʾ');
                    model.clear(function(result){
                        Ext.Msg.hide();
                        if(result != true){
                            Ext.Msg.alert('��ʾ', result);
                        }
                        this.grid.getStore().reload();
                    }, this);
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    }
    
});