

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
                text : '新增字段',
                tooltip : '新增一个字段,点击应用按钮将新增字段添加到对应的数据表中',
                iconCls : 'rs-action-create',
                scope : this,
                handler : this.createNewColumn
            }, {
                text : '应用',
                tooltip : '将新增、删除、修改的数据字段应用到对应的数据表上',
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
                header : '操作',
                align : 'center',
                menuDisabled : true,
                items : [{
                    iconCls : 'generalmodel-column-icon',
                    tooltip: '编辑数据列信息',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showModelColumnPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalmodel-delcolumn-icon',
                    tooltip: '删除该数据列,点击应用后将删除的列应用到对应的数据表上',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delModelColumn(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header : '状态',
                width : 80,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'status',
                align : 'center',
                renderer : function(v){
                    if(v == 'ADD'){
                        return '<span style="color:red;">新增</span>'
                    }else if(v == 'REMOVE'){
                        return '<span style="color:red;">删除</span>'
                    }else if(v == 'EDIT'){
                        return '<span style="color:red;">编辑</span>'
                    }else {
                        return '<span style="color:green;">已应用</span>'
                    }
                }
            }, {
                header   : '是否为主键',
                width    : 100,
                sortable : false,
                menuDisabled : true,
                align : 'center',
                dataIndex : 'primary',
                renderer : function(v){
                    if(v == 'true'){
                        return '<span style="color:red;">主键</span>'
                    }else {
                        return '<span style="color:green;">非主键</span>'
                    }
                }
            }, {
                header   : '列名称', 
                width    : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex: 'columnName'
            }, {
                header : '列说明',
                width : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'columnComment'
            }, {
                header : '数据类型',
                width : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'dataType'
            }, {
                header : '默认值',
                width : 100,
                sortable : false,
                menuDisabled : true,
                dataIndex : 'defaultValue'
            }, {
                header : '备注',
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
                    fieldLabel : '模型编码',
                    readOnly : true,
                    maxLength : 30, 
                    columnWidth: 1
                }], [{
                    dataIndex : 'columnName',
                    allowBlank : false,
                    fieldLabel : '列名称',
                    maxLength : 30,
                    columnWidth: 1
                }], [{
                    xtype : 'combo',
                    dataIndex : 'primary',
                    allowBlank : false,
                    fieldLabel : '是否为主键',
                    triggerAction : 'all',
                    editable : false,
                    lazyRender : true,
                    mode : 'local',
                    valueField: 'key',
                    displayField: 'value',
                    store : new Ext.data.ArrayStore({
                        fields : ['key', 'value'],
                        data : [['true', '主键'], ['false', '非主键']]
                    }),
                    columnWidth: 1
                }], [{
                    dataIndex : 'columnComment',
                    allowBlank : true,
                    fieldLabel : '列说明',
                    maxLength : 100,
                    columnWidth: 1
                }], [{
                    xtype : 'combo',
                    dataIndex : 'dataType',
                    allowBlank : false,
                    fieldLabel : '数据类型',
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
                    fieldLabel : '默认值',
                    maxLength : 100,
                    columnWidth: 1
                }], [{
                    dataIndex : 'remark',
                    allowBlank : true,
                    fieldLabel : '备注',
                    maxLength : 300,
                    columnWidth: 1
                }]]
            },
            buttonAlign : 'center',
            buttons : [{
                text : '保存',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.saveModelColumn                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
            }]
        });
        
        return new Rs.ext.app.CardPanel(config);
    },
    
    //保存
    saveModelColumn : function(){
    	var flag = true;
        if(this.editorPanel.fieldValidate() == true){
            var model = this.editorPanel.getModel();
            var type = model.data.dataType;
            var defValue = model.data.defaultValue;
            var colName = model.data.columnName;
            var reg = /^[0-9a-zA-Z_]+$/;
            if(!colName.match(reg)){
            	Ext.Msg.alert('提示', '列名称包含违法字符!');
            	flag = false;
            }
            if(type == 'number'){
            	if(defValue != null && isNaN(defValue)){
            		Ext.Msg.alert('提示','数据类型与默认值不匹配!');
            		flag = false;
            	}
            }else if(type.indexOf('nvarchar') == 0){
            	var len = Number(type.substring(10 , type.length-1));
            	if(defValue != null && len < defValue.length){
            		Ext.Msg.alert('提示','数据类型与默认值长度不匹配!');
            		flag = false;
            	}
            	
            }
        }
        if(this.editorPanel.fieldValidate() == true && flag == true){
        	var model = this.editorPanel.getModel();
            Ext.Msg.wait('正在保存...', '提示');
            model.save(function(result){
                Ext.Msg.hide();
                if(result != true){
                    Ext.Msg.alert('提示', '保存失败!');
                }else {
                    this.grid.getStore().reload();
                }
            }, this);
        }
    },
    
    //创建新的列
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
    
    //显示数据列信息
    showModelColumnPanel : function(columnData){
        this.editorPanel.collapsed ? this.editorPanel.expand():null;
        var column = new Rs.ext.app.Model({
            url: GENERALMODEL_DATASERVICE,
            saveMethod : 'saveModelColumn',
            data : columnData
        });        
        //当编辑了列备注、数据类型、默认值得时候，修改状态，其他字段修改不影响数据库表则不需要修改状态
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
    
    //应用数据库更新
    applyModelColumnUpdate : function(){
        Ext.MessageBox.show({
            title:'提示',
            msg: '您确定要应用所做的修改吗？应用后将无法恢复!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var head = this.modelHead;
                    var service = new Rs.data.Service({
                        url: GENERALMODEL_DATASERVICE,
                        method : 'applyModelColumnUpdate'
                    });
                    Ext.Msg.wait('正在应用...', '提示');
                    service.call({
                        params : {
                            data : {
                                modelCode : head.get('modelCode')
                            }
                        }
                    }, function(result){
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
    
    //删除一行
    delModelColumn : function(columnData){
        Ext.MessageBox.show({
            title:'提示',
            msg: '您确定要删除该字段吗？删除后将无法恢复!',
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
                    Ext.Msg.wait('正在删除...', '提示');
                    column.save(function(result){
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