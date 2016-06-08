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
                    text : '����',
                    iconCls : 'rs-action-save',
                    tooltip : '���浱ǰѡ���е��ֶ�����',
                    scope : this,
                    handler : this.saveFormLine
                }, {
                    text : '����ֶ�',
                    iconCls : 'generalform-addfiled-icon',
                    tooltip : '����ǰѡ��������µ��ֶ�',
                    scope : this,
                    handler : this.addNewField
                }, {
                    text : 'ɾ����ǰ��',
                    tooltip : 'ɾ����ǰѡ����',
                    iconCls : 'generalform-delformline-icon',
                    scope : this,
                    handler : this.delFieldLine
                }],
                items : [main]
            })]
        });
        
        rs.pub.GeneralFormFieldLinePanel.superclass.constructor.apply(this, arguments);
    },
    
    //���ñ��ֶ�����Ϣ
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
    
    //�������
    getNavPanel : function(config){
        Ext.apply(config, {
            tbar : [{
                iconCls : 'generalform-addformline-icon',
                text : '������',
                scope : this,
                handler : this.addNewLine
            }],
            border : true,
            autoScroll : true,
            bodyStyle : 'padding-left:10px;padding-top:20px;padding-right:10px;padding-bottom:10px;'
        });
        return new Ext.Panel(config);
    },
    
    //��һ��
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
    
    //�������õ������
    resetNavpanel : function(){
        this.navButtons = {};
        var formFieldLine = this.formFieldLine;
        var nav = this.fieldLineNavPanel;
        //ɾ��֮ǰ������
        nav.removeAll(true);
        //��������µ�
        var fieldLines = formFieldLine.get('fieldLines') || [];
        Ext.each(fieldLines, function(line){
            var panel = new Ext.Panel({
                border : false,
                html : '<div class="generalform-btn">��'
                    + line.lineNo +'��</div>'
            });
            panel.on('render', function(){
                panel.getEl().on('click', function(){
                    this.showFieldLine(line.lineNo);
                }, this);
            }, this);
            nav.add(panel);
            //��¼������ť
            this.navButtons[line.lineNo] = panel;
        }, this);
        nav.doLayout();
    },
    
    //�����
    getMainPanel : function(config){
        Ext.apply(config, {
            border : false,
            items : []
        });
        return new Ext.TabPanel(config);
    },
    
    //���������
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
    
    //��ʾĳһ������
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
            
            //��ǰ����״̬��ť
            this.activeButton = nb;
            
            //��ʾ��lineNo�е��ֶ�
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
                        fieldLabel : '�༭��',
                        triggerAction : 'all',
                        editable : false,
                        lazyRender : true,
                        mode : 'local',
                        valueField: 'key',
                        displayField: 'value',
                        store : new Ext.data.ArrayStore({
                            fields : ['key', 'value'],
                            data : [['textfield', '�ı���'],['datefield', '���ڿؼ�'],
                                    ['combo', '������'],['textarea', '�ı���'],
                                    ['rs-ext-telescope', '��Զ��'],['numberfield', '���ֿؼ�']
                                    /*['checkbox', '��ѡ��']*/
                                    /*['htmleditor', 'HTML�༭��']*/
                                    /*['label', '��ǩ'],*/]
                        }),
                        columnWidth: .4
                    }, {
                        xtype : 'rs-ext-telescope',
                        dataIndex : 'dataIndex',
                        fieldLabel : '�ֶ�',
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
                        fieldLabel : '��ǩ',
                        maxLength : 30,
                        columnWidth: .3
                    }], [{
                        xtype : 'combo',
                        allowBlank : false,
                        dataIndex : 'readOnly',
                        fieldLabel : '�Ƿ�ֻ��',
                        triggerAction : 'all',
                        editable : false,
                        lazyRender : true,
                        mode : 'local',
                        valueField: 'key',
                        displayField: 'value',
                        store : new Ext.data.ArrayStore({
                            fields : ['key', 'value'],
                            data : [['expression', '��ֻ�����ʽ����'], ['true', 'ֻ��'],['false', '��ֻ��']]
                        }),
                        columnWidth: .4
                    }, {
                        xtype : 'numberfield',
                        dataIndex : 'width',
                        fieldLabel : '���',
                        maxLength : 10,
                        columnWidth: .3
                    }, {
                        xtype : 'numberfield',
                        dataIndex : 'columnWidth',
                        fieldLabel : 'ռ���',
                        maxValue : 1,
                        minValue : 0.1,
                        maxLength : 10,
                        columnWidth: .3
                    }], [{
                        dataIndex : 'readOnlyExpression',
                        fieldLabel : 'ֻ�����ʽ',
                        maxLength : 500,
                        maskRe : '',
                        columnWidth: .7
                    }, {
                        dataIndex : 'value',
                        fieldLabel : 'ֵ',
                        maxLength : 100,
                        columnWidth: .3
                    }], [{
                        xtype : 'textarea',
                        dataIndex : 'fieldConfig',
                        fieldLabel : '��չ����',
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
                        fieldLabel : 'ע',
                        value : 'ֻ�����ʽ��һ���߼�Ϊ���ٵ�JS���ʽ,����:model.get(\'eto_flag\') == \'Y\''
                    },
                    right : {
                        fontSize : 10,
                        color : 'red',
                        fieldLabel : 'ע',
                        value : '��չ���Ա�����JSON��ʽ��д������<span style="color:blue;">{</span>��ʼ����<span style="color:blue;">}</span>��β��'
                    }
                }
            });
            fieldPanels.push(fieldPanel);
            mainPanel.add(new Ext.Panel({
                closable : true,
                layout : 'fit',
                title : '��' + fieldData.fieldNo + '��',
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
    
    //���һ���ֶ�
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
                xtype : 'textfield', //Ĭ��Ϊ�ı���
                readOnly : 'false', //Ĭ�Ϸ�ֻ��
                fieldConfig : '{\n\n}'
            });
            this.doShowFiledLine(fieldLine, (fieldNo - 1));
        }
    }, 
    
    //ɾ��һ���ֶ�
    delAFile : function(p){
        (function(p){
            Ext.MessageBox.show({
                title:'��ʾ',
                msg: '��ȷ��Ҫɾ�����ֶ���ɾ�����޷��ָ�!',
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
    
    //ִ��ɾ������
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
                        //��������һ�ε�ǰ�е���Ϣ
                        Ext.Msg.wait('���ڱ���...', '��ʾ');
                        fieldLine.save(function(result){
                            Ext.Msg.hide();
                            this.doShowFiledLine(fieldLine);
                            if(result != true){
                                Ext.Msg.alert('��ʾ', result);
                            }
                        }, this);
                    }
                }
            }, this);
        }
    },
    
    //�������ֶ���Ϣ
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
                Ext.Msg.wait('���ڱ���...', '��ʾ');
                fieldLine.save(function(result){
                    Ext.Msg.hide();
                    if(result != true){
                        Ext.Msg.alert('��ʾ', result);
                    }else {
                        var formFieldLine = this.formFieldLine;
                        
                        var a = fieldLine;
                        
                        var b = this;
                    }
                }, this);
            }
        }
    }, 
    
    //ɾ����ǰ��
    delFieldLine : function(){
        Ext.MessageBox.show({
            title:'��ʾ',
            msg: '��ȷ��Ҫɾ����ǰ����ɾ�����޷��ָ�!',
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
    
    //ִ��ɾ������
    doDelFieldLine : function(fieldLine){
        Ext.Msg.wait('���ڱ���...', '��ʾ');
        fieldLine.clear(function(result){
            Ext.Msg.hide();
            if(result != true){
                Ext.Msg.alert('��ʾ', result);
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