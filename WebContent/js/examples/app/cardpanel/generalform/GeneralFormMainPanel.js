Rs.define('rs.pub.GeneralFormMainPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        
        var grid = this.grid = this.getGrid({
            region : 'center'
        });
        
        Ext.apply(config, {
            title : 'ͨ�ñ�ҳ���',
            layout : 'border',
            border : false,
            tbar : [{
                text : '����',
                tooltip : '�½�һ��ͨ�ñ�ҳ',
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
                header : '����',
                align : 'center',
                menuDisabled : true,
                items : [{
                    iconCls : 'generalform-formheader-icon',
                    tooltip: 'ͨ�ñ�ҳ��������',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormHeadPanel({
                            saveMethod : 'save',
                            data : Ext.apply({}, rec.data)
                        });
                        //���ñ����벻�ɱ༭
                        this.headPanel.setFieldReadOnly('formCode', true);
                    }
                }, {
                    iconCls : 'generalform-formregion-icon',
                    tooltip: 'ͨ�ñ�ҳ����ҳͷҳ����Ϣ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormRegionPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-fileline-icon',
                    tooltip: 'ͨ�ñ�ҳ�ֶ���Ϣ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormFieldLinePanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-action-icon',
                    tooltip: 'ͨ�ñ�ҳҵ�����',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormActionsPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-preview-icon',
                    tooltip: 'Ԥ��ͨ�ñ�ҳ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralFormPreviewPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalform-delform-icon',
                    tooltip: 'ɾ����ͨ�ñ�ҳ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delGeneralForm(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header   : '������', 
                width    : 100,
                sortable : true, 
                dataIndex: 'formCode'
            }, {
                header : '������',
                width : 200,
                sortable : true,
                dataIndex : 'formName'
            }, {
                header : '��ϵͳ����',
                width : 100,
                sortable : true,
                dataIndex : 'subSys'
            }, {
                header : '����ģ�ͱ���',
                width : 200,
                sortable : true,
                dataIndex : 'modelCode'
            }, {
                header : '��ѯ����',
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
    
    //��ʾͷ��Ϣ����
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
                        value : 'ͨ�ñ�ҳ������Ϣ'
                    }
                },
                formBody : {
                    fields : [[{
                        dataIndex : 'formCode',
                        allowBlank : false,
                        fieldLabel : '������',
                        maxLength : 30,
                        columnWidth: .3
                    }, {
                        dataIndex : 'formName',
                        allowBlank : false,
                        fieldLabel : '������',
                        maxLength : 50,
                        columnWidth: .4
                    }, {
                        dataIndex : 'subSys',
                        allowBlank : false,
                        fieldLabel : '��ϵͳ',
                        maxLength : 8,
                        columnWidth: .3
                    }], [{
                        xtype : 'rs-ext-telescope',
                        dataIndex : 'modelCode',
                        allowBlank : false,
                        fieldLabel : '����ģ��',
                        singleSelect : true,
                        editable : false,
                        progCode : 'pubModel',
                        valueField: 'MODEL_CODE',
                        displayField: 'MODEL_NAME',
                        columnWidth: .3
                    }, {
                        dataIndex : 'businessCondition',
                        fieldLabel : '��ѯ����',
                        maxLength : 200,
                        columnWidth: .7
                    }]]
                },
                formFooter : {
                    left : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : 'ע',
                        value : '��ѯ������ʹ��ռλ�������磺<span style="color:blue;">item_code=@ic and io_flag=@flag</span>'
                            + '<br/>����<span style="color:blue;">@ic</span>��<span style="color:blue;">@flag</span>Ϊռλ����'
                            + '��Ӧ�򿪿�Ƭҳ��ʱ����Ĳ���,��: http://ʡ��/rs/pub/cardpanel?ic=100&flag=I'
                    }
                }
            });
            this.headWindow = new Ext.Window({
                title : 'ͨ�ñ�ҳ��������',
                width : 800,
                height : 300,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [headPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '����',
                    iconCls : 'rs-action-save',
                    scope : this,
                    handler : this.saveHead
                }, {
                    text : 'ȡ��',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.headWindow.hide();
                    }
                }]
            });
        }
        //�����µ�����ģ��
        this.headPanel.setModel(head);
        //��ʾ����
        this.headWindow.show();
    },
    
    //����
    saveHead : function(){
        if(this.headPanel.fieldValidate() == true){
            var head = this.headPanel.getModel();
            Ext.Msg.wait('���ڱ���...', '��ʾ');
            head.save(function(result){
                Ext.Msg.hide();
                if(result == true){
                    this.headWindow.hide();
                    this.grid.getStore().reload();
                }else {
                    Ext.Msg.alert('��ʾ', result, function(){
                        this.grid.getStore().reload();
                    }, this);
                }
            }, this);
        }
    }, 
    
    //�������ÿ�Ƭ����
    createGeneralForm : function(){
        this.showGeneralFormHeadPanel({
            saveMethod : 'create',
            data : {}
        });
        //���ñ�����ɱ༭
        this.headPanel.setFieldReadOnly('formCode', false);
    }, 
    
    //��ʾ������ҳͷҳ����Ϣ���
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
                title : 'ͨ�ñ�ҳ����ҳͷҳ����Ϣ',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [regionPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '�ر�',
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
    
    //��ʾ�ֶ������
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
                title : 'ͨ�ñ�ҳ�ֶ���Ϣ',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [fieldLinePanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '�ر�',
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
    
    //Ԥ��
    showGeneralFormPreviewPanel : function(headData){
        var previewPanel = this.previewPanel;
        if(!previewPanel){
            previewPanel = this.previewPanel = new rs.pub.GeneralFormPreviewPanel({
                
            });
            this.previewWindow = new Ext.Window({
                title : 'Ԥ��',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : true,
                items : [previewPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '�ر�',
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
    
    //ɾ��ͨ��ҵ���
    delGeneralForm : function(headData){
        Ext.MessageBox.show({
            title:'��ʾ',
            msg: '��ȷ��Ҫɾ����ͨ�ñ�ҳ��ɾ�����޷��ָ�!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = new Rs.ext.app.Model({
                        url: GENERALFORM_DATASERVICE,
                        clearMethod : 'clearGeneralForm',
                        data : headData
                    });
                    Ext.Msg.wait('����ɾ��....', '��ʾ');
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
    }, 
    
    //��ҵ��������
    showGeneralFormActionsPanel : function(headData){
        var actionsPanel = this.actionsPanel;
        if(!actionsPanel){
            actionsPanel = this.actionsPanel = new rs.pub.GeneralFormActionsPanel({
            });
            this.actionsWindow = new Ext.Window({
                title : 'ͨ�ñ�ҳҵ�����',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : true,
                items : [actionsPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '�ر�',
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