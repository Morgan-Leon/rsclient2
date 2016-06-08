Rs.define('rs.pub.GeneralModelMainPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        
        var grid = this.grid = this.getGrid({
            region : 'center'
        });
        
        Ext.apply(config, {
            title : '通用数据模型',
            layout : 'border',
            tbar : [{
                text : '新增',
                tooltip : '新增一个通用数据模型',
                iconCls : 'rs-action-create',
                scope: this,
                handler : this.createGeneralModel
            }, {
                text : '根据已有数据表新增',
                tooltip : '根据数据库中一个数据表创建通用数据模型,以数据表表名为通用数据模型的编码',
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
                header : '操作',
                align : 'center',
                menuDisabled : true,
                items : [{
                    iconCls : 'generalmodel-head-icon',
                    tooltip: '通用数据模型基本信息',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralModelHeadPanel({
                            saveMethod : 'saveModelHead',
                            data : Ext.apply({}, rec.data)
                        });
                        //设置模型编码不可编辑
                        this.headPanel.setFieldReadOnly('modelCode', true);
                    }
                }, {
                    iconCls : 'generalmodel-column-icon',
                    tooltip: '通用数据模型数据列信息',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.showGeneralModelColumnPanel(Ext.apply({}, rec.data));
                    }
                }, {
                    iconCls : 'generalmodel-delmodel-icon',
                    tooltip: '删除通用数据模型',
                    scope : this,
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        this.delGeneralModel(Ext.apply({}, rec.data));
                    }
                }]
            }, {
                header   : '模型编码', 
                width    : 150,
                sortable : true, 
                dataIndex: 'modelCode'
            }, {
                header   : '模型名称', 
                width    : 150,
                sortable : true, 
                dataIndex: 'modelName'
            }, {
                header : '数据表名',
                width : 200,
                sortable : true,
                dataIndex : 'tableName'
            }, {
                header : '备注',
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
    
    //创建数据模型
    createGeneralModel : function(headData){
        this.showGeneralModelHeadPanel({
            saveMethod : 'createModelHead',
            data : {}
        });
        //设置模型编码可编辑
        this.headPanel.setFieldReadOnly('modelCode', false);
    },
    
    //显示
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
                        value : '通用数据模型基本信息'
                    }
                },
                formBody : {
                    fields : [[{
                        dataIndex : 'modelCode',
                        allowBlank : false,
                        fieldLabel : '模型编码',
                        maxLength : 30,
                        columnWidth: .5
                    }, {
                        dataIndex : 'modelName',
                        allowBlank : false,
                        fieldLabel : '模型名称',
                        maxLength : 50,
                        columnWidth: .5
                    }], [{
                        dataIndex : 'tableName',
                        allowBlank : false,
                        fieldLabel : '数据库表',
                        maxLength : 90,
                        columnWidth: 1
                    }], [{
                        dataIndex : 'remark',
                        allowBlank : false,
                        fieldLabel : '备注',
                        maxLength : 300,
                        columnWidth: 1
                    }]]
                },
                formFooter : {
                    left : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : '注',
                        value : '数据库表对应数据库中的一个具体的table(表)或view(视图)'
                    }
                }
            });
            this.headWindow = new Ext.Window({
                title : '通用数据模型基本信息',
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
                    handler : this.saveModelHead
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
	        	Ext.Msg.alert('提示', '新增数据库表名包含违法字符!');
	        	flag = false;
	        }
    	}
        if(this.headPanel.fieldValidate() == true && flag == true){
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
    
    //编辑数据模型列
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
                title : '通用数据模型数据列信息',
                width : 800,
                height : 600,
                layout : 'fit',
                modal : true,
                closable : false,
                resizable : false,
                items : [columnPanel],
                buttonAlign : 'center',
                buttons : [{
                    text : '关闭',
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
    
    //根据已有数据表新增数据模型
    createGeneralModelByTable : function(){
        Ext.Msg.prompt('提示', '请输入数据表名称', function(btn, text){
            if (btn == 'ok' && Ext.isEmpty(text, false) == false){
                var service = new Rs.data.Service({
                    url: GENERALMODEL_DATASERVICE,
                    method : 'createGeneralModelByTable'
                });
                Ext.Msg.wait('正在保存...', '提示');
                service.call({
                    params : {
                        tableName : text
                    }
                }, function(result){
                    Ext.Msg.hide();
                    if(result != true){
                        Ext.Msg.alert('提示', result);
                    }
                    this.grid.getStore().reload();
                }, this);
            }
        }, this);
    }, 
    
    //删除通用数据模型
    delGeneralModel : function(modelData){
        Ext.MessageBox.show({
            title:'提示',
            msg: '您确定要删除该通用数据模型吗？删除后将无法恢复!',
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