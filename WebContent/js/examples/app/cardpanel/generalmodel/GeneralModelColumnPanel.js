

Rs.define('rs.pub.GeneralModelColumnPanel', {
    
    extend : Ext.Panel, 
        
    constructor : function(config){

        var editor = this.editorPanel = this.getEditorPanel({
            margins : '5 5 5 1',
            region : 'east',
            width : 250,
            minWidth : 250,
            maxWidth : 250,
            collapsed : true,
            collapsible : false,
            animCollapse : false,
            split : true,
            border : true,
            collapseMode : "mini"
        });
        
        var grid = this.grid = this.getGrid({
            margins : '5 1 5 5',
            region : 'center'
        });
        
        Ext.apply(config, {
            border : false,
            layout : 'border',
            items : [grid, editor], 
            tbar : [{
                text : '�����ֶ�',
                tooltip : '����һ���ֶ�,���Ӧ�ð�ť�������ֶ���ӵ���Ӧ�����ݱ���',
                iconCls : 'rs-action-create',
                scope : this,
                handler : this.createNewColumn
            }, {
                text : 'Ӧ��',
                tooltip : '��������ɾ�����޸ĵ������ֶ�Ӧ�õ���Ӧ�����ݱ���',
                iconCls : 'rs-action-ok',
                scope : this,
                handler : this.applyModelColumnUpdate
            }]
        });
        
        rs.pub.GeneralModelColumnPanel.superclass.constructor.apply(this, arguments);
    },
    
    setModelHead : function(modelHead){
        this.modelHead = modelHead;
        
        var store = this.grid.getStore();
        store.baseParams['modelCode'] = modelHead.get('modelCode');
        store.load();
    }, 
    
    getGrid : function(config){
        
        var store = new Rs.ext.data.Store({
            autoLoad : false,
            autoDestroy: true,
            url: GENERALMODEL_DATASERVICE,
            root: 'modelcolumns',
            readMethod : 'getModelColumns',
            idProperty: 'columnName',
            fields: ['modelCode', 'columnName', 'columnComment', 'dataType', 
                     'defaultValue', 'remark', 'status', 'primary'],
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
                    iconCls : 'generalmodel-column-icon',
                    tooltip: '�༭��������Ϣ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showModelColumnPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalmodel-delcolumn-icon',
                    tooltip: 'ɾ����������,���Ӧ�ú�ɾ������Ӧ�õ���Ӧ�����ݱ���',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delModelColumn(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header : '״̬',
                width : 80,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'status',
                align : 'center',
                renderer : function(v){
                    if(v == 'ADD'){
                        return '<span style="color:red;">����</span>'
                    }else if(v == 'REMOVE'){
                        return '<span style="color:red;">ɾ��</span>'
                    }else if(v == 'EDIT'){
                        return '<span style="color:red;">�༭</span>'
                    }else {
                        return '<span style="color:green;">��Ӧ��</span>'
                    }
                }
            }, {
                header   : '�Ƿ�Ϊ����',
                width    : 100,
                sortable : false,
                menuDisabled : true,
                align : 'center',
                dataIndex : 'primary',
                renderer : function(v){
                    if(v == 'true'){
                        return '<span style="color:red;">����</span>'
                    }else {
                        return '<span style="color:green;">������</span>'
                    }
                }
            }, {
                header   : '������', 
                width    : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex: 'columnName'
            }, {
                header : '��˵��',
                width : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'columnComment'
            }, {
                header : '��������',
                width : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'dataType'
            }, {
                header : 'Ĭ��ֵ',
                width : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'defaultValue'
            }, {
                header : '��ע',
                width : 200,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'remark'
            }]
        });
        return new Ext.grid.GridPanel(config);
    },
    
    getEditorPanel : function(config){
        Ext.apply(config, {
            formBody : {
                fieldLabelWidth : 55,
                fields : [[{
                    dataIndex : 'modelCode',
                    allowBlank : false,
                    fieldLabel : 'ģ�ͱ���',
                    readOnly : true,
                    maxLength : 30, 
                    columnWidth: 1
                }], [{
                    dataIndex : 'columnName',
                    allowBlank : false,
                    fieldLabel : '������',
                    maxLength : 30,
                    columnWidth: 1
                }], [{
                    xtype : 'combo',
                    dataIndex : 'primary',
                    allowBlank : false,
                    fieldLabel : '�Ƿ�Ϊ����',
                    triggerAction : 'all',
                    editable : false,
                    lazyRender : true,
                    mode : 'local',
                    valueField: 'key',
                    displayField: 'value',
                    store : new Ext.data.ArrayStore({
                        fields : ['key', 'value'],
                        data : [['true', '����'], ['false', '������']]
                    }),
                    columnWidth: 1
                }], [{
                    dataIndex : 'columnComment',
                    allowBlank : true,
                    fieldLabel : '��˵��',
                    maxLength : 100,
                    columnWidth: 1
                }], [{
                    xtype : 'combo',
                    dataIndex : 'dataType',
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
                        data : [['number', 'number'],
                                ['nvarchar2(1)', 'nvarchar2(1)'],
                                ['nvarchar2(5)', 'nvarchar2(5)'],
                                ['nvarchar2(10)', 'nvarchar2(10)'],
                                ['nvarchar2(15)', 'nvarchar2(15)'],
                                ['nvarchar2(19)', 'nvarchar2(19)'],
                                ['nvarchar2(20)', 'nvarchar2(20)'],
                                ['nvarchar2(30)', 'nvarchar2(30)'],
                                ['nvarchar2(300)', 'nvarchar2(300)'],
                                ['nvarchar2(1000)', 'nvarchar2(1000)'],
                                ['nvarchar2(4000)', 'nvarchar2(4000)']]
                    }),
                    columnWidth: 1
                }], [{
                    dataIndex : 'defaultValue',
                    allowBlank : true,
                    fieldLabel : 'Ĭ��ֵ',
                    maxLength : 100,
                    columnWidth: 1
                }], [{
                    dataIndex : 'remark',
                    allowBlank : true,
                    fieldLabel : '��ע',
                    maxLength : 300,
                    columnWidth: 1
                }]]
            },
            buttonAlign : 'center',
            buttons : [{
                text : '����',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.saveModelColumn                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            }]
        });
        
        return new Rs.ext.app.CardPanel(config);
    },
    
    //����
    saveModelColumn : function(){
    	var flag = true;
        if(this.editorPanel.fieldValidate() == true){
            var model = this.editorPanel.getModel();
            var type = model.data.dataType;
            var defValue = model.data.defaultValue;
            var colName = model.data.columnName;
            var reg = /^[0-9a-zA-Z_]+$/;
            if(!colName.match(reg)){
            	Ext.Msg.alert('��ʾ', '�����ư���Υ���ַ�!');
            	flag = false;
            }
            if(type == 'number'){
            	if(defValue != null && isNaN(defValue)){
            		Ext.Msg.alert('��ʾ','����������Ĭ��ֵ��ƥ��!');
            		flag = false;
            	}
            }else if(type.indexOf('nvarchar') == 0){
            	var len = Number(type.substring(10 , type.length-1));
            	if(defValue != null && len < defValue.length){
            		Ext.Msg.alert('��ʾ','����������Ĭ��ֵ���Ȳ�ƥ��!');
            		flag = false;
            	}
            	
            }
        }
        if(this.editorPanel.fieldValidate() == true && flag == true){
        	var model = this.editorPanel.getModel();
            Ext.Msg.wait('���ڱ���...', '��ʾ');
            model.save(function(result){
                Ext.Msg.hide();
                if(result != true){
                    Ext.Msg.alert('��ʾ', '����ʧ��!');
                }else {
                    this.grid.getStore().reload();
                }
            }, this);
        }
    },
    
    //�����µ���
    createNewColumn : function(){
        this.editorPanel.collapsed ? this.editorPanel.expand():null;
        var head = this.modelHead;
        var column = new Rs.ext.app.Model({
            url: GENERALMODEL_DATASERVICE,
            saveMethod : 'createModelColumn',
            data : {
                modelCode : head.get('modelCode'),
                primary : 'false'
            }
        });
        this.editorPanel.setModel(column);
        this.editorPanel.setFieldReadOnly('columnName', false);
    },
    
    //��ʾ��������Ϣ
    showModelColumnPanel : function(columnData){
        this.editorPanel.collapsed ? this.editorPanel.expand():null;
        var column = new Rs.ext.app.Model({
            url: GENERALMODEL_DATASERVICE,
            saveMethod : 'saveModelColumn',
            data : columnData
        });        
        //���༭���б�ע���������͡�Ĭ��ֵ��ʱ���޸�״̬�������ֶ��޸Ĳ�Ӱ�����ݿ������Ҫ�޸�״̬
        column.on('change', function(model, dataIndex, value){
            var status = model.get('status');
            if(status != 'ADD'){
                if(dataIndex == 'dataType'){
                    model.set('status', 'EDIT');
                }
            }
        }, this);
        this.editorPanel.setModel(column);
        this.editorPanel.setFieldReadOnly('columnName', true);
    }, 
    
    //Ӧ�����ݿ����
    applyModelColumnUpdate : function(){
        Ext.MessageBox.show({
            title:'��ʾ',
            msg: '��ȷ��ҪӦ���������޸���Ӧ�ú��޷��ָ�!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var head = this.modelHead;
                    var service = new Rs.data.Service({
                        url: GENERALMODEL_DATASERVICE,
                        method : 'applyModelColumnUpdate'
                    });
                    Ext.Msg.wait('����Ӧ��...', '��ʾ');
                    service.call({
                        params : {
                            data : {
                                modelCode : head.get('modelCode')
                            }
                        }
                    }, function(result){
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
    
    //ɾ��һ��
    delModelColumn : function(columnData){
        Ext.MessageBox.show({
            title:'��ʾ',
            msg: '��ȷ��Ҫɾ�����ֶ���ɾ�����޷��ָ�!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var column = new Rs.ext.app.Model({
                        url: GENERALMODEL_DATASERVICE,
                        saveMethod : 'saveModelColumn',
                        data : Ext.apply(columnData, {
                            status : 'REMOVE'
                        })
                    });
                    Ext.Msg.wait('����ɾ��...', '��ʾ');
                    column.save(function(result){
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