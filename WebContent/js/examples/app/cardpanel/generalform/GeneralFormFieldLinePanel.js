Rs.define('rs.pub.GeneralFormFieldLinePanel', {
    
    extend : Ext.Panel,
    
    constructor : function(config){
        
        var nav = this.fieldLineNavPanel = this.getNavPanel({
            region : 'west',
            margins : '5 2 5 5',
            width : 100
        });
        
        var main = this.fieldLineMainPanel = this.getMainPanel({});
        main.on('activate', function(p){
            p.doLayout();
        }, this);
        
        Ext.apply(config, {
            layout : 'border',
            border : false,
            items : [nav, new Ext.Panel({
                region : 'center',
                border : true,
                margins : '5 5 5 2',
                tbar : [{
                    text : '保存',
                    iconCls : 'rs-action-save',
                    tooltip : '保存当前选中行的字段设置',
                    scope : this,
                    handler : this.saveFormLine
                }, {
                    text : '添加字段',
                    iconCls : 'generalform-addfiled-icon',
                    tooltip : '给当前选中行添加新的字段',
                    scope : this,
                    handler : this.addNewField
                }, {
                    text : '删除当前行',
                    tooltip : '删除当前选中行',
                    iconCls : 'generalform-delformline-icon',
                    scope : this,
                    handler : this.delFieldLine
                }],
                items : [main]
            })]
        });
        
        rs.pub.GeneralFormFieldLinePanel.superclass.constructor.apply(this, arguments);
    },
    
    //设置表单字段行信息
    setFormFieldLine : function(formFieldLine){
        this.formFieldLine = formFieldLine;
        if(this.rendered){
            this.resetNavpanel();
            this.resetMainPanel();
        }else {
            this.on('render', function(){
                this.resetNavpanel();
                this.resetMainPanel();
            }, this, {
                single : true,
                delay : 100
            })
        }
    },
    
    //导航面板
    getNavPanel : function(config){
        Ext.apply(config, {
            tbar : [{
                iconCls : 'generalform-addformline-icon',
                text : '新增行',
                scope : this,
                handler : this.addNewLine
            }],
            border : true,
            autoScroll : true,
            bodyStyle : 'padding-left:10px;padding-top:20px;padding-right:10px;padding-bottom:10px;'
        });
        return new Ext.Panel(config);
    },
    
    //加一行
    addNewLine : function(){
        var formFieldLine = this.formFieldLine;
        var formCode = formFieldLine.get('formCode');
        var fieldLines = formFieldLine.get('fieldLines');
        var lineNo = 0;
        Ext.each(fieldLines, function(line){
            if(line.lineNo > lineNo){
                lineNo = line.lineNo;
            }
        }, this);
        lineNo = Number(lineNo) + 1;
        fieldLines.push({
            formCode : formCode,
            lineNo : lineNo,
            fields : []
        });
        this.resetNavpanel();
        this.resetMainPanel();
        this.showFieldLine(lineNo);
    },
    
    //重新设置导航面板
    resetNavpanel : function(){
        this.navButtons = {};
        var formFieldLine = this.formFieldLine;
        var nav = this.fieldLineNavPanel;
        //删掉之前的所有
        nav.removeAll(true);
        //重新添加新的
        var fieldLines = formFieldLine.get('fieldLines') || [];
        Ext.each(fieldLines, function(line){
            var panel = new Ext.Panel({
                border : false,
                html : '<div class="generalform-btn">第'
                    + line.lineNo +'行</div>'
            });
            panel.on('render', function(){
                panel.getEl().on('click', function(){
                    this.showFieldLine(line.lineNo);
                }, this);
            }, this);
            nav.add(panel);
            //记录导航按钮
            this.navButtons[line.lineNo] = panel;
        }, this);
        nav.doLayout();
    },
    
    //主面板
    getMainPanel : function(config){
        Ext.apply(config, {
            border : false,
            items : []
        });
        return new Ext.TabPanel(config);
    },
    
    //重置主面板
    resetMainPanel : function(){
        var mainPanel = this.fieldLineMainPanel;
        mainPanel.removeAll(true);
        var formFieldLine = this.formFieldLine;
        var fieldLines = formFieldLine.get('fieldLines') || [];
        if(fieldLines.length > 0){
            var line = fieldLines[0];
            this.showFieldLine(line.lineNo);
        }
    },
    
    //显示某一行内容
    showFieldLine : function(lineNo){
        var nb = this.navButtons[lineNo];
        var ab = this.activeButton; 
        if(ab == nb){
            return;
        }else {
            if(ab){
                var el = ab.getEl().child('.generalform-btn')
                if(el){
                    el.replaceClass('generalform-btn-active', 'generalform-btn-inactive');
                }
            }
            var el = nb.getEl().child('.generalform-btn');
            el.replaceClass('generalform-btn-inactive', 'generalform-btn-active');
            
            //当前激活状态按钮
            this.activeButton = nb;
            
            //显示第lineNo行的字段
            var formFieldLine = this.formFieldLine;
            var formCode = formFieldLine.get('formCode');
            var fieldLines = formFieldLine.get('fieldLines') || [];
            var fieldLineData;
            Ext.each(fieldLines, function(line){
                if(line.lineNo == lineNo){
                    fieldLineData = line; 
                }
            }, this);
            var fieldLine = this.fieldLine = new Rs.ext.app.Model({
                url: GENERALFORM_DATASERVICE,
                saveMethod : 'saveFieldLine',
                clearMethod : 'clearFieldLine',
                data : fieldLineData
            });
            this.doShowFiledLine(fieldLine);
        }
    },
    
    //private
    doShowFiledLine : function(fieldLine, tabItem){
        var mainPanel = this.fieldLineMainPanel;
        mainPanel.removeAll(true);
        
        var fieldPanels = [];
        var fields = fieldLine.get('fields');
        Ext.each(fields, function(fieldData){
            var field = new Rs.ext.app.Model({
                url: GENERALFORM_DATASERVICE,
                clearMethod : 'clearField',
                data : fieldData
            });
            var fieldPanel = new Rs.ext.app.CardPanel(field, {
                height : 500,
                formBody : {
                    fields : [[{
                        xtype : 'combo',
                        allowBlank : false,
                        dataIndex : 'xtype',
                        fieldLabel : '编辑器',
                        triggerAction : 'all',
                        editable : false,
                        lazyRender : true,
                        mode : 'local',
                        valueField: 'key',
                        displayField: 'value',
                        store : new Ext.data.ArrayStore({
                            fields : ['key', 'value'],
                            data : [['textfield', '文本框'],['datefield', '日期控件'],
                                    ['combo', '下拉框'],['textarea', '文本域'],
                                    ['rs-ext-telescope', '望远镜'],['numberfield', '数字控件']
                                    /*['checkbox', '复选框']*/
                                    /*['htmleditor', 'HTML编辑器']*/
                                    /*['label', '标签'],*/]
                        }),
                        columnWidth: .4
                    }, {
                        xtype : 'rs-ext-telescope',
                        dataIndex : 'dataIndex',
                        fieldLabel : '字段',
                        singleSelect : true,
                        editable : false,
                        progCode : 'pubModelCols',
                        valueField: 'COLUMN_NAME',
                        displayField: 'COLUMN_NAME',
                        buildProgCondtion : (function(condition, panel){
                            return (Ext.isEmpty(condition, false) ? '' : condition + ' and ')
                                +  ' model_code = \'' + panel.formFieldLine.get('modelCode') + '\'';
                        }).createDelegate(this, [this], true),
                        columnWidth: .3
                    }, {
                        dataIndex : 'fieldLabel',
                        fieldLabel : '标签',
                        maxLength : 30,
                        columnWidth: .3
                    }], [{
                        xtype : 'combo',
                        allowBlank : false,
                        dataIndex : 'readOnly',
                        fieldLabel : '是否只读',
                        triggerAction : 'all',
                        editable : false,
                        lazyRender : true,
                        mode : 'local',
                        valueField: 'key',
                        displayField: 'value',
                        store : new Ext.data.ArrayStore({
                            fields : ['key', 'value'],
                            data : [['expression', '由只读表达式决定'], ['true', '只读'],['false', '非只读']]
                        }),
                        columnWidth: .4
                    }, {
                        xtype : 'numberfield',
                        dataIndex : 'width',
                        fieldLabel : '宽度',
                        maxLength : 10,
                        columnWidth: .3
                    }, {
                        xtype : 'numberfield',
                        dataIndex : 'columnWidth',
                        fieldLabel : '占宽比',
                        maxValue : 1,
                        minValue : 0.1,
                        maxLength : 10,
                        columnWidth: .3
                    }], [{
                        dataIndex : 'readOnlyExpression',
                        fieldLabel : '只读表达式',
                        maxLength : 500,
                        maskRe : '',
                        columnWidth: .7
                    }, {
                        dataIndex : 'value',
                        fieldLabel : '值',
                        maxLength : 100,
                        columnWidth: .3
                    }], [{
                        xtype : 'textarea',
                        dataIndex : 'fieldConfig',
                        fieldLabel : '扩展属性',
                        height : 310,
                        maxLength : 500,
                        columnWidth: 1,
                        maskRe : ''
                    }]]
                },
                formFooter : {
                    left : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : '注',
                        value : '只读表达式是一个逻辑为真或假的JS表达式,例如:model.get(\'eto_flag\') == \'Y\''
                    },
                    right : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : '注',
                        value : '扩展属性必须以JSON格式编写，并以<span style="color:blue;">{</span>开始，以<span style="color:blue;">}</span>结尾。'
                    }
                }
            });
            fieldPanels.push(fieldPanel);
            mainPanel.add(new Ext.Panel({
                closable : true,
                layout : 'fit',
                title : '第' + fieldData.fieldNo + '个',
                items : [fieldPanel],
                listeners : {
                    'beforeclose' : {
                        fn : this.delAFile,
                        scope : this
                    }
                }
            }));
        }, this);
        
        this.fieldPanels = fieldPanels;
        mainPanel.setActiveTab(tabItem ? tabItem : 0);
    },
    
    //添加一个字段
    addNewField : function(){
        var formFieldLine = this.formFieldLine;
        var formCode = formFieldLine.get('formCode');
        var fieldLine = this.fieldLine;
        if(fieldLine){
            var lineNo = fieldLine.get('lineNo');
            var fields = fieldLine.get('fields');
            var fieldNo = 0;
            Ext.each(fields, function(fieldData){
                if(fieldNo < fieldData.fieldNo){
                    fieldNo = fieldData.fieldNo;
                }
            }, this);
            fieldNo =  Number(fieldNo) + 1;
            fields.push({
                formCode : formCode,
                lineNo : lineNo,
                fieldNo : fieldNo,
                xtype : 'textfield', //默认为文本框
                readOnly : 'false', //默认非只读
                fieldConfig : '{\n\n}'
            });
            this.doShowFiledLine(fieldLine, (fieldNo - 1));
        }
    }, 
    
    //删除一个字段
    delAFile : function(p){
        (function(p){
            Ext.MessageBox.show({
                title:'提示',
                msg: '您确定要删除该字段吗？删除后将无法恢复!',
                buttons: Ext.Msg.YESNO,
                scope : this,
                fn: function(btn){
                    if(btn == 'yes'){
                        var cp = p.items.get(0);
                        var m = null;
                        if(cp && (m = cp.getModel())){
                            this.doDelAFiel(m);
                        }
                    }
                },
                icon: Ext.MessageBox.QUESTION
            });
        }).defer(100, this, [p]);
        return false;
    },
    
    //执行删除操作
    doDelAFiel : function(field){
        if(field){
            field.clear(function(result){
                if(result == true){
                    var formFieldLine = this.formFieldLine;
                    var formCode = formFieldLine.get('formCode');
                    var fieldLine = this.fieldLine;
                    if(fieldLine){
                        var fields = [];
                        Ext.each(fieldLine.get('fields'), function(fieldData){
                            if(field.get('fieldNo') != fieldData.fieldNo){
                                fields.push(fieldData);
                            }
                        }, this);
                        Ext.each(fields, function(fieldData, idx){
                            fieldData.fieldNo = idx + 1;
                        }, this);
                        fieldLine.set('fields', fields);
                        //主动保存一次当前行的信息
                        Ext.Msg.wait('正在保存...', '提示');
                        fieldLine.save(function(result){
                            Ext.Msg.hide();
                            this.doShowFiledLine(fieldLine);
                            if(result != true){
                                Ext.Msg.alert('提示', result);
                            }
                        }, this);
                    }
                }
            }, this);
        }
    },
    
    //保存行字段信息
    saveFormLine : function(){
        var error = null;
        var fields = [];
        var fieldPanels = this.fieldPanels || [];
        Ext.each(fieldPanels, function(fieldPanel){
            if(fieldPanel instanceof Rs.ext.app.CardPanel){
                fields.push(fieldPanel.getModel().getData());
                /*
                if(fieldPanel.fieldValidate() != true){
                    error = fieldPanel;
                    return false;
                }
                */
            }
        }, this);
        if(error){
            var mainPanel = this.fieldLineMainPanel;
            mainPanel.setActiveTab(error.ownerCt);
            return;
        }else {
            var fieldLine = this.fieldLine;
            if(fieldLine){
                fieldLine.set("fields", fields);
                Ext.Msg.wait('正在保存...', '提示');
                fieldLine.save(function(result){
                    Ext.Msg.hide();
                    if(result != true){
                        Ext.Msg.alert('提示', result);
                    }else {
                        var formFieldLine = this.formFieldLine;
                        
                        var a = fieldLine;
                        
                        var b = this;
                    }
                }, this);
            }
        }
    }, 
    
    //删除当前行
    delFieldLine : function(){
        Ext.MessageBox.show({
            title:'提示',
            msg: '您确定要删除当前行吗？删除后将无法恢复!',
            buttons: Ext.Msg.YESNO,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var fieldLine = this.fieldLine;
                    if(fieldLine){
                        this.doDelFieldLine(fieldLine);
                    }
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    }, 
    
    //执行删除操作
    doDelFieldLine : function(fieldLine){
        Ext.Msg.wait('正在保存...', '提示');
        fieldLine.clear(function(result){
            Ext.Msg.hide();
            if(result != true){
                Ext.Msg.alert('提示', result);
            }else {
                var formFieldLine = this.formFieldLine;
                var formCode = formFieldLine.get('formCode');
                var fieldLines = [];
                Ext.each(formFieldLine.get('fieldLines'), function(line){
                    if(fieldLine.get('lineNo') != line.lineNo){
                        fieldLines.push(line);
                    }
                }, this);
                Ext.each(fieldLines, function(line, idx){
                    line.lineNo = idx + 1;
                }, this);
                formFieldLine.set('fieldLines', fieldLines);
                
                this.resetNavpanel();
                this.resetMainPanel();
            }
        }, this);
    }
    
});