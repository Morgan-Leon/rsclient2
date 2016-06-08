Rs.define('rs.pub.GeneralModelMainPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        
        var grid = this.grid = this.getGrid({
            region : 'center'
        });
        
        Ext.apply(config, {
            title : 'ͨ������ģ��',
            layout : 'border',
            tbar : [{
                text : '����',
                tooltip : '����һ��ͨ������ģ��',
                iconCls : 'rs-action-create',
                scope: this,
                handler : this.createGeneralModel
            }, {
                text : '�����������ݱ�����',
                tooltip : '�������ݿ���һ�����ݱ���ͨ������ģ��,�����ݱ����Ϊͨ������ģ�͵ı���',
                iconCls : 'rs-action-attribute',
                scope: this,
                handler : this.createGeneralModelByTable
            }],
            items : [grid]
        });
        rs.pub.GeneralModelMainPanel.superclass.constructor.apply(this, arguments);
    },
    
    getGrid : function(config){
        
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            url: GENERALMODEL_DATASERVICE,
            root: 'generalmodel',
            idProperty: 'modelCode',
            sortField : 'modelCode',
            fields: ['modelCode', 'modelName', 'tableName', 'remark'],
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
                    iconCls : 'generalmodel-head-icon',
                    tooltip: 'ͨ������ģ�ͻ�����Ϣ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralModelHeadPanel({
                            saveMethod : 'saveModelHead',
                            data : Ext.apply({}, rec.data)
                        });
                        //����ģ�ͱ��벻�ɱ༭
                        this.headPanel.setFieldReadOnly('modelCode', true);
                    }
                }, {
                    iconCls : 'generalmodel-column-icon',
                    tooltip: 'ͨ������ģ����������Ϣ',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralModelColumnPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalmodel-delmodel-icon',
                    tooltip: 'ɾ��ͨ������ģ��',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delGeneralModel(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header   : 'ģ�ͱ���', 
                width    : 150,
                sortable : true, 
                dataIndex: 'modelCode'
            }, {
                header   : 'ģ������', 
                width    : 150,
                sortable : true, 
                dataIndex: 'modelName'
            }, {
                header : '���ݱ���',
                width : 200,
                sortable : true,
                dataIndex : 'tableName'
            }, {
                header : '��ע',
                width : 200,
                sortable : true,
                dataIndex : 'remark'
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
    
    //��������ģ��
    createGeneralModel : function(headData){
        this.showGeneralModelHeadPanel({
            saveMethod : 'createModelHead',
            data : {}
        });
        //����ģ�ͱ���ɱ༭
        this.headPanel.setFieldReadOnly('modelCode', false);
    },
    
    //��ʾ
    showGeneralModelHeadPanel : function(config){
        var head = new Rs.ext.app.Model(Ext.apply({
             url: GENERALMODEL_DATASERVICE
        }, config));
        var headPanel = this.headPanel;
        if(!headPanel){
            headPanel = this.headPanel = new Rs.ext.app.CardPanel({
                formHeader : {
                    center : {
                        fontSize : 24,
                        value : 'ͨ������ģ�ͻ�����Ϣ'
                    }
                },
                formBody : {
                    fields : [[{
                        dataIndex : 'modelCode',
                        allowBlank : false,
                        fieldLabel : 'ģ�ͱ���',
                        maxLength : 30,
                        columnWidth: .5
                    }, {
                        dataIndex : 'modelName',
                        allowBlank : false,
                        fieldLabel : 'ģ������',
                        maxLength : 50,
                        columnWidth: .5
                    }], [{
                        dataIndex : 'tableName',
                        allowBlank : false,
                        fieldLabel : '���ݿ��',
                        maxLength : 90,
                        columnWidth: 1
                    }], [{
                        dataIndex : 'remark',
                        allowBlank : false,
                        fieldLabel : '��ע',
                        maxLength : 300,
                        columnWidth: 1
                    }]]
                },
                formFooter : {
                    left : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : 'ע',
                        value : '���ݿ���Ӧ���ݿ��е�һ�������table(��)��view(��ͼ)'
                    }
                }
            });
            this.headWindow = new Ext.Window({
                title : 'ͨ������ģ�ͻ�����Ϣ',
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
                    handler : this.saveModelHead
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
        this.headPanel.setModel(head);
        this.headWindow.show();
    }, 
    
    //
    saveModelHead : function(){
    	var flag = true;
    	if(this.headPanel.fieldValidate() == true){
            var head = this.headPanel.getModel();
            var tableName = head.data.tableName;
	    	var reg = /^[0-9a-zA-Z_]+$/;
	        if(!tableName.match(reg)){
	        	Ext.Msg.alert('��ʾ', '�������ݿ��������Υ���ַ�!');
	        	flag = false;
	        }
    	}
        if(this.headPanel.fieldValidate() == true && flag == true){
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
    
    //�༭����ģ����
    showGeneralModelColumnPanel : function(headData){
        
        var head = new Rs.ext.app.Model({
            url: GENERALMODEL_DATASERVICE,
            data : headData
        });
        
        var columnPanel = this.columnPanel;
        if(!columnPanel){
            columnPanel = this.columnPanel = new rs.pub.GeneralModelColumnPanel({
                
            });
            this.columnWindow = new Ext.Window({
                title : 'ͨ������ģ����������Ϣ',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [columnPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '�ر�',
                    scope : this,
                    iconCls : 'rs-action-cancel',
                    handler : function(){
                        this.columnWindow.hide();
                    }
                }]
            });
        }
        
        this.columnPanel.setModelHead(head);
        this.columnWindow.show();
    }, 
    
    //�����������ݱ���������ģ��
    createGeneralModelByTable : function(){
        Ext.Msg.prompt('��ʾ', '���������ݱ�����', function(btn, text){
            if (btn == 'ok' && Ext.isEmpty(text, false) == false){
                var service = new Rs.data.Service({
                    url: GENERALMODEL_DATASERVICE,
                    method : 'createGeneralModelByTable'
                });
                Ext.Msg.wait('���ڱ���...', '��ʾ');
                service.call({
                    params : {
                        tableName : text
                    }
                }, function(result){
                    Ext.Msg.hide();
                    if(result != true){
                        Ext.Msg.alert('��ʾ', result);
                    }
                    this.grid.getStore().reload();
                }, this);
            }
        }, this);
    }, 
    
    //ɾ��ͨ������ģ��
    delGeneralModel : function(modelData){
        Ext.MessageBox.show({
            title:'��ʾ',
            msg: '��ȷ��Ҫɾ����ͨ������ģ����ɾ�����޷��ָ�!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = new Rs.ext.app.Model({
                        url: GENERALMODEL_DATASERVICE,
                        clearMethod : 'clearGeneralModel',
                        data : modelData
                    });
                    model.clear(function(result){
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