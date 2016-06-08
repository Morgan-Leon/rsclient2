Rs.define('rs.pub.GeneralFormMainPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        
        var grid = this.grid = this.getGrid({
            region : 'center'
        });
        
        Ext.apply(config, {
            title : '通用表单页设计',
            layout : 'border',
            border : false,
            tbar : [{
                text : '新增',
                tooltip : '新建一个通用表单页',
                iconCls : 'rs-action-create',
                scope: this,
                handler : this.createGeneralForm
            }],
            items : [grid]
        });
        rs.pub.GeneralFormMainPanel.superclass.constructor.apply(this, arguments);
    },
    
    getGrid : function(config){
        
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            url: GENERALFORM_DATASERVICE,
            root: 'generalform',
            idProperty: 'formCode',
            sortField : 'formCode',
            fields: ['formCode', 'formName', 'subSys', 
                     'modelCode', 'businessCondition'],
            baseParams : {}
        });
        config = Rs.apply(config || {}, {
            border : false,
            store : store,
            columns : [{
                xtype : 'actioncolumn',
                width : 150,
                header : '操作',
                align : 'center',
                menuDisabled : true,
                items : [{
                    iconCls : 'generalform-formheader-icon',
                    tooltip: '通用表单页基本属性',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormHeadPanel({
                            saveMethod : 'save',
                            data : Ext.apply({}, rec.data)
                        });
                        //设置表单编码不可编辑
                        this.headPanel.setFieldReadOnly('formCode', true);
                    }
                }, {
                    iconCls : 'generalform-formregion-icon',
                    tooltip: '通用表单页标题页头页脚信息',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormRegionPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-fileline-icon',
                    tooltip: '通用表单页字段信息',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormFieldLinePanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-action-icon',
                    tooltip: '通用表单页业务操作',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormActionsPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-preview-icon',
                    tooltip: '预览通用表单页',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormPreviewPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-delform-icon',
                    tooltip: '删除该通用表单页',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delGeneralForm(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header   : '表单编码', 
                width    : 100,
                sortable : true, 
                dataIndex: 'formCode'
            }, {
                header : '表单名称',
                width : 200,
                sortable : true,
                dataIndex : 'formName'
            }, {
                header : '子系统编码',
                width : 100,
                sortable : true,
                dataIndex : 'subSys'
            }, {
                header : '数据模型编码',
                width : 200,
                sortable : true,
                dataIndex : 'modelCode'
            }, {
                header : '查询条件',
                width : 300,
                sortable : true,
                dataIndex : 'businessCondition'
            }],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : store,
                displayInfo : false
            })
        });
        return new Ext.grid.GridPanel(config);
    }, 
    
    //显示头信息窗口
    showGeneralFormHeadPanel : function(config){
        var head = new Rs.ext.app.Model(Ext.apply({
            url: GENERALFORM_DATASERVICE
        }, config));
        var headPanel = this.headPanel;
        if(!headPanel){
            headPanel = this.headPanel = new Rs.ext.app.CardPanel({
                formHeader : {
                    center : {
                        fontSize : 26,
                        value : '通用表单页基本信息'
                    }
                },
                formBody : {
                    fields : [[{
                        dataIndex : 'formCode',
                        allowBlank : false,
                        fieldLabel : '表单编码',
                        maxLength : 30,
                        columnWidth: .3
                    }, {
                        dataIndex : 'formName',
                        allowBlank : false,
                        fieldLabel : '表单名称',
                        maxLength : 50,
                        columnWidth: .4
                    }, {
                        dataIndex : 'subSys',
                        allowBlank : false,
                        fieldLabel : '子系统',
                        maxLength : 8,
                        columnWidth: .3
                    }], [{
                        xtype : 'rs-ext-telescope',
                        dataIndex : 'modelCode',
                        allowBlank : false,
                        fieldLabel : '数据模型',
                        singleSelect : true,
                        editable : false,
                        progCode : 'pubModel',
                        valueField: 'MODEL_CODE',
                        displayField: 'MODEL_NAME',
                        columnWidth: .3
                    }, {
                        dataIndex : 'businessCondition',
                        fieldLabel : '查询条件',
                        maxLength : 200,
                        columnWidth: .7
                    }]]
                },
                formFooter : {
                    left : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : '注',
                        value : '查询条件可使用占位符，例如：<span style="color:blue;">item_code=@ic and io_flag=@flag</span>'
                            + '<br/>其中<span style="color:blue;">@ic</span>和<span style="color:blue;">@flag</span>为占位符，'
                            + '对应打开卡片页面时传入的参数,如: http://省略/rs/pub/cardpanel?ic=100&flag=I'
                    }
                }
            });
            this.headWindow = new Ext.Window({
                title : '通用表单页基本属性',
                width : 800,
                height : 300,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [headPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '保存',
                    iconCls : 'rs-action-save',
                    scope : this,
                    handler : this.saveHead
                }, {
                    text : '取消',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.headWindow.hide();
                    }
                }]
            });
        }
        //设置新的数据模型
        this.headPanel.setModel(head);
        //显示窗口
        this.headWindow.show();
    },
    
    //保存
    saveHead : function(){
        if(this.headPanel.fieldValidate() == true){
            var head = this.headPanel.getModel();
            Ext.Msg.wait('正在保存...', '提示');
            head.save(function(result){
                Ext.Msg.hide();
                if(result == true){
                    this.headWindow.hide();
                    this.grid.getStore().reload();
                }else {
                    Ext.Msg.alert('提示', result, function(){
                        this.grid.getStore().reload();
                    }, this);
                }
            }, this);
        }
    }, 
    
    //创建公用卡片程序
    createGeneralForm : function(){
        this.showGeneralFormHeadPanel({
            saveMethod : 'create',
            data : {}
        });
        //设置表单编码可编辑
        this.headPanel.setFieldReadOnly('formCode', false);
    }, 
    
    //显示表单标题页头页脚信息面板
    showGeneralFormRegionPanel : function(headData){
        
        var formRegion = new Rs.ext.app.Model({
            url: GENERALFORM_DATASERVICE,
            loadMethod : 'getFormRegion',
            data : {
                formCode : headData.formCode,
                modelCode : headData.modelCode
            }
        });
        formRegion.load(function(formRegion){
            this.doShowGeneralFormRegionPanel(formRegion);
        }, this);
    }, 
    
    //private
    doShowGeneralFormRegionPanel : function(formRegion){
        var regionPanel = this.regionPanel;
        if(!regionPanel){
            regionPanel = this.regionPanel = new rs.pub.GeneralFormRegionPanel({
                border : false
            });
            this.regionWindow = new Ext.Window({
                title : '通用表单页标题页头页脚信息',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [regionPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.regionWindow.hide();
                    }
                }]
            });
        }
        this.regionPanel.setFormRegion(formRegion);
        this.regionWindow.show();
    }, 
    
    //显示字段行面板
    showGeneralFormFieldLinePanel : function(headData){
        var formFieldLine = new Rs.ext.app.Model({
            url: GENERALFORM_DATASERVICE,
            loadMethod : 'getFormFieldLine',
            data : {
                formCode : headData.formCode,
                modelCode : headData.modelCode
            }
        });
        formFieldLine.load(function(formFieldLine){
            this.doShowGeneralFormFieldLinePanel(formFieldLine);
        }, this);
    },
    
    //private
    doShowGeneralFormFieldLinePanel : function(formFieldLine){
        var fieldLinePanel = this.fieldLinePanel;
        if(!fieldLinePanel){
            fieldLinePanel = this.fieldLinePanel = new rs.pub.GeneralFormFieldLinePanel({
                border : false
            });
            this.fieldLineWindow = new Ext.Window({
                title : '通用表单页字段信息',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [fieldLinePanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.fieldLineWindow.hide();
                    }
                }]
            });
        }
        this.fieldLinePanel.setFormFieldLine(formFieldLine);
        this.fieldLineWindow.show();
    }, 
    
    //预览
    showGeneralFormPreviewPanel : function(headData){
        var previewPanel = this.previewPanel;
        if(!previewPanel){
            previewPanel = this.previewPanel = new rs.pub.GeneralFormPreviewPanel({
                
            });
            this.previewWindow = new Ext.Window({
                title : '预览',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : true,
                items : [previewPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.previewWindow.hide();
                    }
                }]
            });
        }
        var generalForm = new Rs.ext.app.Model({
            url: GENERALFORM_DATASERVICE,
            loadMethod : 'getGeneralForm',
            data : Ext.apply({}, headData)
        });
        generalForm.load(function(form){
            this.previewPanel.setGeneralForm(form);
            this.previewWindow.show();
        }, this);
    }, 
    
    //删除通用业务表单
    delGeneralForm : function(headData){
        Ext.MessageBox.show({
            title:'提示',
            msg: '您确定要删除该通用表单页吗？删除后将无法恢复!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = new Rs.ext.app.Model({
                        url: GENERALFORM_DATASERVICE,
                        clearMethod : 'clearGeneralForm',
                        data : headData
                    });
                    Ext.Msg.wait('正在删除....', '提示');
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
    }, 
    
    //打开业务操作面板
    showGeneralFormActionsPanel : function(headData){
        var actionsPanel = this.actionsPanel;
        if(!actionsPanel){
            actionsPanel = this.actionsPanel = new rs.pub.GeneralFormActionsPanel({
            });
            this.actionsWindow = new Ext.Window({
                title : '通用表单页业务操作',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : true,
                items : [actionsPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.actionsWindow.hide();
                    }
                }]
            });
        }
        var head = new Rs.ext.app.Model({
            data : headData
        });
        this.actionsPanel.setGeneralHead(head);
        this.actionsWindow.show();
    }
    
});