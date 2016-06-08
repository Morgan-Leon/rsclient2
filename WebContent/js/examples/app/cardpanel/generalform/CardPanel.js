
Rs.define('Rs.ext.app.CardPanel', {
    
    extend : Ext.Panel,
    
    constructor : function(model, config) {
        
        if(!(model instanceof Rs.ext.app.Model)){
            config = model || {};
            //如果没有传入model对象,则自己创建一个
            model = new Rs.ext.app.Model({
                data : {}
            });
        }
        
        this.model = model;
        
        this.fieldTemplate = new Ext.XTemplate(
            '<div style="text-align:{align};color:{color};font-size:{fontSize}px;">',
                '<tpl if="this.hasFieldLabel(values)">',
                    '<span style="font-weight:bold;">{fieldLabel}</span>:',
                '</tpl>',
                '<span>&nbsp{value}&nbsp<span>',
            '</div>', {
                hasFieldLabel : function(values){
                    return Ext.isEmpty(values.fieldLabel, false) != true;
                }
            }
        );
        
        //记录表单可修改字段对应的组件
        this.formBodyFields = {};
        
        var items = []; 
        
        this.formHeader = config.formHeader;
        this.formBody = config.formBody;
        this.formFooter = config.formFooter;
        
        this.initFormHeaderTop(items, this.formHeader);
        this.initFormHeaderCenter(items, this.formHeader);
        this.initFormHeaderBottom(items, this.formHeader);
        
        this.readOnlyExpressionCache = {};
        this.initFormBody(items, this.formBody);
        this.onModelChangeEvalReadOnlyExpression();
        
        this.initFormFooter(items, this.formFooter);
        
        config = Ext.applyIf(config || {}, {
            layout : {
                type : 'vbox',
                padding : 10,
                defaultMargins : {
                    top : 0,
                    right : 0,
                    left : 0,
                    bottom : 0
                },
                align : 'stretch'
            },
            border: false,
            items : items
        });
        
        Rs.ext.app.CardPanel.superclass.constructor.call(this, config);
    },
    
    //初始化表单头部分
    initFormHeaderTop : function(items, formHeader){
        
        formHeader = formHeader || {};
        
        //表单头
        var fhpti = [];
        
        //表单头第一行左边内容
        var fhl = formHeader.left;
        if(Ext.isEmpty(fhl, false) == false){
            var fhlc = {
                fontSize : 14,
                color : '#000000',
                align : 'left',
                value : '&nbsp'
            };
            if(Ext.isString(fhl)){
                fhl = Ext.apply({
                    value : fhl
                }, fhlc);
            }else {
                Ext.applyIf(fhl, fhlc);
            }
            var dataIndex = fhl.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhl, {
                    value : this.model.get(dataIndex)
                })
            }
            //记录左面板属性
            this.formHeaderLeftConfig = fhl;
            //创建左面板
            var leftPanel = this.formHeaderLeftPanel = new Ext.Panel({
                border : false,
                columnWidth: .5,
                html : this.fieldTemplate.applyTemplate(fhl)
            });
            fhpti.push(leftPanel);
            
            if(Ext.isEmpty(dataIndex, false) == false){
                //监听当模型中值发生变化后更新组件值
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, leftPanel, fhl){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhl, {
                            value : value
                        });
                        Ext.get(leftPanel.body).update(this.fieldTemplate.applyTemplate(fhl));
                    }
                }).createDelegate(this, [dataIndex, leftPanel, fhl], true), this);    
            }
        }
        
        //表单头第一行右边内容
        var fhr = formHeader.right;
        if(Ext.isEmpty(fhr, false) == false){
            var fhrc = {
                fontSize : 14,
                color : '#000000',
                align : 'right',
                value : '&nbsp'
            };
            
            if(Ext.isString(fhr)){
                fhr = Ext.apply({
                    value : fhr
                }, fhrc);
            }else {
                Ext.applyIf(fhr, fhrc);
            }
            var dataIndex = fhr.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhr, {
                    value : this.model.get(dataIndex)
                })
            }
            
            //记录右面板信息
            this.formHeaderRightConfig = fhr;
            
            //创建右面板
            var rightPanel = this.formHeaderRightPanel = new Ext.Panel({
                border : false,
                xtype : 'panel',
                columnWidth: fhpti.length == 1 ? .5 : 1, //如果左边位置上有内容则第一行均分两部分
                html : this.fieldTemplate.applyTemplate(fhr)
            });
            fhpti.push(rightPanel);
            
            if(Ext.isEmpty(dataIndex, false) == false){
                //监听当模型中值发生变化后更新组件值
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, rightPanel, fhr){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhr, {
                            value : value
                        });
                        Ext.get(rightPanel.body).update(this.fieldTemplate.applyTemplate(fhr));
                    }
                }).createDelegate(this, [dataIndex, rightPanel, fhr], true), this);    
            }
        }
                
        //表单头第一行内容
        if(fhpti.length > 0){
            items.push({
                xtype : 'panel',
                border : false,
                layout : 'column',
                items : fhpti
            });
        }
        
        return items;
    },
    
    //初始化表单头部分
    initFormHeaderCenter : function(items, formHeader){
        
        formHeader = formHeader || {};
        //表单头
        var fhpti = [];
        var fhc = formHeader.center;
        if(Ext.isEmpty(fhc, false) == false){
            var fhcc = {
                fontSize : 36,
                color : '#000000',
                align : 'center',
                value : '&nbsp'
            };
            if(Ext.isString(fhc)){
                fhc = Ext.apply({
                    value : fhc
                }, fhcc);
            }else {
                Ext.applyIf(fhc, fhcc);
            }
            var dataIndex = fhc.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhc, {
                    value : this.model.get(dataIndex)
                });
            }
            //记录标题配置信息
            this.formHeaderCenterConfig = fhc;
            //创建标题面板
            var panel = this.formHeaderCenterPanel = new Ext.Panel({
                border : false,
                //layout : 'fit',
                html : this.fieldTemplate.applyTemplate(fhc)
            });
            items.push(panel);
            if(Ext.isEmpty(dataIndex, false) == false){
                //监听当模型中值发生变化后更新组件值
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, panel, fhc){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhc, {
                            value : value
                        });
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(fhc));
                    }
                }).createDelegate(this, [dataIndex, panel, fhc], true), this);    
            }
        }
        return items;
    },
    
    //初始化表单头部分
    initFormHeaderBottom : function(items, formHeader){
        
        formHeader = formHeader || {};
        //表单头
        var fhpti = [];
        var fhcb = formHeader.bottom;
        if(Ext.isEmpty(fhcb, false) == false){
            var fhcbc = {
                fontSize : 14,
                color : '#000000',
                align : 'center',
                value : '&nbsp'
            };
            if(Ext.isString(fhcb)){
                Ext.apply({
                    value : fhcb
                }, fhcbc);
            }else {
                Ext.applyIf(fhcb, fhcbc);
            }
            var dataIndex = fhcb.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhcb, {
                    value : this.model.get(dataIndex)
                });
            }
            //记录副标题配置信息
            this.formHeaderBottomConfig = fhcb;
            //创建副标题面板
            var panel = this.formHeaderBottomPanel = new Ext.Panel({
                border : false,
                bodyStyle : 'padding-bottom:5px;',
                html : this.fieldTemplate.applyTemplate(fhcb)
            });
            items.push(panel);
            if(Ext.isEmpty(dataIndex, false) == false){
                //监听当模型中值发生变化后更新组件值
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, panel, fhcb){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhcb, {
                            value : value
                        });
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(fhcb));
                    }
                }).createDelegate(this, [dataIndex, panel, fhcb], true), this);    
            }
        }
        return items;
    },
    
    //初始化表单体字段部分
    initFormBody : function(items, formBody){
        
        formBody = formBody || {};
        //统一设置标签宽度,如果某字段有自己的标签宽度，则以其为标准
        var fieldLabelWidth = formBody.fieldLabelWidth || 80;
        
        //字段信息
        var fields = formBody.fields || [];
        for(var i = 0 ; i < fields.length; i++ ){
            var row = fields[i], fs = [];
            for(var j = 0 ; j < row.length; j++){
                
                var cfg = Ext.applyIf(row[j], {
                    xtype : 'textfield',
                    labelWidth : fieldLabelWidth,
                    autoWidth : true
                });
                
                var labelWidth = cfg.labelWidth;
                var columnWidth = cfg.columnWidth;
                delete cfg.columnWidth;
                delete cfg.labelWidth;
                
                var dataIndex = cfg.dataIndex;
                
                //如果为由只读表达式决定则验证只读表达式
                var readOnlyExpression = cfg.readOnlyExpression;
                if(Ext.isEmpty(dataIndex, false) == false 
                    && cfg.readOnly === 'expression'
                    && Ext.isEmpty(readOnlyExpression, false) == false){
                    
                    //记录只读表达式
                    this.readOnlyExpressionCache[dataIndex] = readOnlyExpression;
                    //验证
                    var readOnly = this.evalReadOnlyExpression(readOnlyExpression, this.model);
                    if(Ext.isBoolean(readOnly)){
                        Ext.apply(cfg, {
                            readOnly : readOnly
                        });
                    }
                }
                delete cfg.readOnlyExpression;
                
                //应由表达式决定，但表达式计算后仍为expression 则设置组件非只读
                if(cfg.readOnly == 'true' || cfg.readOnly == true){
                    cfg.readOnly = true;
                }else if(cfg.readOnly == 'false' || cfg.readOnly == false){
                    cfg.readOnly = false;
                }else {
                    delete cfg.readOnly;
                }
                
                //创建组件
                var field = Ext.create(cfg, cfg.xtype); 
                if(Ext.isEmpty(dataIndex, false) == false){
                    
                    //记录表单体内字段对应的编辑器
                    this.formBodyFields[dataIndex] = field;
                    
                    //模型上值发生变化修改界面上的值
                    this.model.on('change', (function(model, dataIndex1, value, dataIndex2, field){
                        if(dataIndex1 === dataIndex2){
                            this.setValueHelper(field, value);
                        }
                    }).createDelegate(this, [dataIndex, field], true), this);
                    
                    //如果是HTML编辑器则要监听其sync事件
                    if(field instanceof Ext.form.HtmlEditor){
                        field.on('sync', (function(f, nv, dataIndex, model){                        
                            this.model.set(dataIndex, this.getValueHelper(f, nv));                        
                        }).createDelegate(this, [dataIndex, this.model], 2), this);
                    }else {
                        //界面值发生变化修改模型上的值
                        field.on('change', (function(f, nv, ov, dataIndex, model){                        
                            this.model.set(dataIndex, this.getValueHelper(f, nv));                        
                        }).createDelegate(this, [dataIndex, this.model], 3), this);
                    }
                }
                
                fs.push({
                    xtype : 'panel',
                    bodyStyle : 'padding-top:5px;',
                    layout : 'form',
                    border : false,
                    labelAlign : 'right',
                    labelWidth : labelWidth,
                    columnWidth : columnWidth,
                    mainField : field,
                    items : [field],
                    listeners : {
                        'render' : {
                            fn : function(p){
                                //从模型中取出值来显示在组件上
                                var f = p.mainField;
                                if(Ext.isEmpty(f.dataIndex, false) == false){
                                    var v = this.model.get(f.dataIndex);
                                    this.setValueHelper(f, v);
                                }
                                //
                            },
                            scope : this,
                            single : true
                        },
                        'resize' : {
                            fn : function(p, aw, ah, rw, rh){
                                var lw = p.mainField.label ? p.mainField.label.getWidth() + 8 : 0;
                                var w = aw - lw;
                                if(w > 40){
                                    this.setFieldWidthHelper(p.mainField, w);                                    
                                }
                            },
                            scope : this
                        }
                    }
                });
            }
            items.push({
                xtype : 'panel',
                layout : 'column',
                border: false,
                items : fs
            });
        }
    },
    
    //监听当数据模型值发生变化的时候验证只读表达式
    onModelChangeEvalReadOnlyExpression : function(){
        this.model.on('change', function(model){
            for(var dataIndex2 in this.readOnlyExpressionCache){
                var readOnlyExpression = this.readOnlyExpressionCache[dataIndex2];
                var readOnly = this.evalReadOnlyExpression(readOnlyExpression, model);
                if(Ext.isBoolean(readOnly)){
                    this.setFieldReadOnly(dataIndex2, readOnly);
                }
            }
        }, this);
    },
    
    //初始化表单最下面也脚部分
    initFormFooter : function(items, formFooter){
        
        formFooter = formFooter || {};
        //表单尾 左边
        var ffpi = [];
        var ffl = formFooter.left;
        var ffc = formFooter.center;
        var ffr = formFooter.right;
        
        var hasffl = Ext.isEmpty(ffl, false) === false; 
        var hasffc = Ext.isEmpty(ffc, false) === false;
        var hasffr = Ext.isEmpty(ffr, false) === false;
        
        //左边
        if(hasffl === true){
            var fflc = {
                fontSize : 14,
                color : '#000000',
                align : 'left'
            }
            if(Ext.isString(ffl)){
                ffl = Ext.apply({
                    value : ffl
                }, fflc);
            }else {
                Ext.applyIf(ffl, fflc);
            }
            var dataIndex = ffl.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(ffl, {
                    value : this.model.get(dataIndex)
                })
            }
            //记录页脚左面板配置信息
            this.formFooterLeftConfig = ffl;
            //创建页脚左面板
            var leftPanel = this.formFooterLeftPanel = new Ext.Panel({
                border : false,
                html : this.fieldTemplate.applyTemplate(ffl)
            });
            ffpi.push(leftPanel);
            if(Ext.isEmpty(dataIndex, false) == false){
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, leftPanel, ffl){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(ffl, {
                            value : value
                        });
                        Ext.get(leftPanel.body).update(this.fieldTemplate.applyTemplate(ffl));
                    }
                }).createDelegate(this, [dataIndex, leftPanel, ffl], true), this);    
            }
        }else {
            ffpi.push({
                xtype : 'panel',
                border : false,
                html : '<div style="width:100px;">&nbsp</div>'
            });
        }
        
        //中间
        if(hasffc === true){
            var ffcc = {
                fontSize : 14,
                color : '#000000',
                align : 'center'
            };
            if(Ext.isString(ffc)){
                ffc = Ext.apply({
                    value : ffc
                }, ffcc);
            }else {
                Ext.applyIf(ffc, ffcc);
            }
            var dataIndex = ffc.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(ffc, {
                    value : this.model.get(dataIndex)
                });
            }
            //记录页脚中间面板配置信息
            this.formFooterCenterConfig = ffc;
            //创建页脚中间面板
            var centerPanel = this.formFooterCenterPanel = new Ext.Panel({
                border : false,
                html : this.fieldTemplate.applyTemplate(ffc)
            });
            ffpi.push(centerPanel);
            if(Ext.isEmpty(dataIndex, false) == false){
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, centerPanel, ffc){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(ffc, {
                            value : value
                        });
                        Ext.get(centerPanel.body).update(this.fieldTemplate.applyTemplate(ffc));
                    }
                }).createDelegate(this, [dataIndex, centerPanel, ffc], true), this);    
            }
        }else {
            ffpi.push({
                xtype : 'panel',
                border : false,
                html : '<div style="width:100px;">&nbsp</div>'
            });
        }
        
        //右边
        if(hasffr === true){
            var ffrc = {
                fontSize : 14,
                color : '#000000',
                align : 'right'
            }
            if(Ext.isString(ffr)){
                ffr = Ext.apply({
                    value : ffc
                }, ffrc);
            }else {
                Ext.applyIf(ffr, ffrc);
            }
            var dataIndex = ffr.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(ffr, {
                    value : this.model.get(dataIndex)
                });
            }
            //记录页脚右面板配置信息
            this.formFooterRightConfig = ffr;
            //创建页脚右面板
            var rightPanel = this.formFooterRightPanel = new Ext.Panel({
                border : false,
                html : this.fieldTemplate.applyTemplate(ffr)
            });
            ffpi.push(rightPanel);
            if(Ext.isEmpty(dataIndex, false) == false){
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, rightPanel, ffr){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(ffr, {
                            value : value
                        });
                        Ext.get(rightPanel.body).update(this.fieldTemplate.applyTemplate(ffr));
                    }
                }).createDelegate(this, [dataIndex, rightPanel, ffr], true), this);    
            }
        }else {
            ffpi.push({
                xtype : 'panel',
                border : false,
                html : '<div style="width:100px;">&nbsp</div>'
            });
        }
        
        // 添加底部信息到卡片中
        if(hasffl === true || hasffc === true || hasffr === true){
            items.push({
                xtype : 'panel',
                border : false,
                layout : 'table',
                layoutConfig: {
                    tableAttrs: {
                        style: {
                            width: '100%'
                        }
                    },
                    columns: 3
                },
                bodyStyle : 'padding-top:5px;',
                items : ffpi
            });
        }
        
        return items;
    }, 
    
    //如果是文本区则使用escape将值进行编码
    setValueHelper : function(field, value){
        if(field instanceof Ext.form.Label){
            field.setText(value);
        }else if(field instanceof Ext.form.TextArea){
            field.setValue(value ? unescape(value) : '');
        }else if(field instanceof Ext.form.DateField){
            field.setValue(value instanceof Date 
                    ? value : Date.parseDate(value, "Y/m/d"));
        }else {
            field.setValue(value);
        }
    },
    
    //如果是文本区则使用escape将值进行编码
    getValueHelper : function(field, value){
        value = value || field.getValue();
        if(field instanceof Ext.form.TextArea){
            return escape(value);
        }else if(field instanceof Ext.form.DateField){
            //如果是日期类型自动转成日期RS10系统默认日期格式
            return value instanceof Date ? value.format('Y/m/d') : value;
        }else {
            return value;
        }
    },
    
    //设置字段宽度
    setFieldWidthHelper : function(field, width){
        //望远镜是TriggerField的子类,但其只读模式下也需要显示Trigger
        if(field instanceof Rs.ext.form.Telescope){
            width = width - 20;
        }else if(field instanceof Ext.form.TriggerField
            && field.readOnly !== true){ //日期空间，下拉框等
            width = width - 20;
        }
        if(Ext.isIE){
        	width = width - 60;
        }
        field.setWidth(width);
        field.el.setWidth(width);
    },
    
    /**
     * 设置某字段只读
     */
    setFieldReadOnly : function(dataIndex, readOnly){
        var field = this.formBodyFields[dataIndex];
        if(field && field instanceof Ext.form.Field){
            field.setReadOnly(readOnly === true);
        }
    }, 
    
    /**
     * 表单字段验证
     */
    fieldValidate : function(){
        var result = true;
        for(var dataIndex in this.formBodyFields){
            var field = this.formBodyFields[dataIndex];
            if(field && field instanceof Ext.form.Field){
                result = field.validate(); 
                if(result !== true){
                    break;
                }
            }
        }
        return result;
    }, 
    
    /**
     * 设置新的数据模型
     */
    setModel : function(model){
        if(!(model instanceof Rs.ext.app.Model)){
            throw 'model必须为Rs.ext.app.Model的实例';
        }
        if(this.model){
            this.model.destroy();
            delete this.model;
        }
        this.model = model;
        
        //更新组件值
        if(this.rendered){
            this.updateFormHeader();
            this.onModelChangeEvalReadOnlyExpression();
            this.updateFormFields();
            this.updateFormFooter();
        }else {
            this.on('render', function(){
                this.updateFormHeader();
                this.onModelChangeEvalReadOnlyExpression();
                this.updateFormFields();
                this.updateFormFooter();
                this.doLayout();
            }, this, {
                single : true,
                delay : 100
            });
        }
    },
    
    /**
     * private 私有方法
     */
    updateFormHeader : function(){
        //左边面板
        var fhl = this.formHeaderLeftConfig;
        if(fhl){
            var dataIndex = fhl.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhl, {
                    value : this.model.get(dataIndex)
                })
            }
            var leftPanel = this.formHeaderLeftPanel;
            if(leftPanel){
                if(leftPanel.rendered){
                    Ext.get(leftPanel.body).update(this.fieldTemplate.applyTemplate(fhl));    
                }else {
                    leftPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(fhl));
                    }, this, {
                        single : true
                    });
                }
                //监听当模型中值发生变化后更新组件值
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, leftPanel, fhl){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhl, {
                            value : value
                        });
                        Ext.get(leftPanel.body).update(this.fieldTemplate.applyTemplate(fhl));
                    }
                }).createDelegate(this, [dataIndex, leftPanel, fhl], true), this);
            }
        }
        //右边面板
        var fhr = this.formHeaderRightConfig;
        if(fhr){
            var dataIndex = fhr.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhr, {
                    value : this.model.get(dataIndex)
                })
            }
            var rightPanel = this.formHeaderRightPanel;
            if(rightPanel){
                if(rightPanel.rendered){
                    Ext.get(rightPanel.body).update(this.fieldTemplate.applyTemplate(fhr));
                }else {
                    rightPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(fhr));
                    }, this, {
                        single : true
                    });
                }
                //监听当模型中值发生变化后更新组件值
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, rightPanel, fhr){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhr, {
                            value : value
                        });
                        Ext.get(rightPanel.body).update(this.fieldTemplate.applyTemplate(fhr));
                    }
                }).createDelegate(this, [dataIndex, rightPanel, fhr], true), this);
            }
        }
        
        //标题
        var fhc = this.formHeaderCenterConfig;
        if(fhc){
            var dataIndex = fhc.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhc, {
                    value : this.model.get(dataIndex)
                })
            }
            var centerPanel = this.formHeaderCenterPanel
            if(centerPanel){
                if(centerPanel.rendered){
                    Ext.get(centerPanel.body).update(this.fieldTemplate.applyTemplate(fhc));
                }else {
                    centerPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(fhc));
                    }, this, {
                        single : true
                    });
                }
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, centerPanel, fhc){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhc, {
                            value : value
                        });
                        Ext.get(centerPanel.body).update(this.fieldTemplate.applyTemplate(fhc));
                    }
                }).createDelegate(this, [dataIndex, centerPanel, fhc], true), this);
            }
        }
        //副标题
        var fhb = this.formHeaderBottomConfig;
        if(fhb){
            var dataIndex = fhb.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(fhb, {
                    value : this.model.get(dataIndex)
                })
            }
            var bottomPanel = this.formHeaderBottomPanel
            if(bottomPanel){
                if(bottomPanel.rendered){
                    Ext.get(bottomPanel.body).update(this.fieldTemplate.applyTemplate(fhb));
                }else {
                    bottomPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(fhb));
                    }, this, {
                        single : true
                    });
                }
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, bottomPanel, fhb){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(fhb, {
                            value : value
                        });
                        Ext.get(bottomPanel.body).update(this.fieldTemplate.applyTemplate(fhb));
                    }
                }).createDelegate(this, [dataIndex, bottomPanel, fhb], true), this);
            }
        }
    },
    
    //private
    updateFormFields : function(){
        for(var dataIndex in this.formBodyFields){
            var field = this.formBodyFields[dataIndex];
            
            //验证只读表达式
            var readOnlyExpression = this.readOnlyExpressionCache[dataIndex];
            if(Ext.isEmpty(readOnlyExpression, false) == false){
                var readOnly = this.evalReadOnlyExpression(readOnlyExpression, this.model);
                if(Ext.isBoolean(readOnly)){
                    this.setFieldReadOnly(dataIndex, readOnly);
                }
            }
            
            //设置组件值
            this.setValueHelper(field, this.model.get(dataIndex));
            
            //模型上值发生变化修改界面上的值
            this.model.on('change', (function(model, dataIndex1, value, dataIndex2, field){
                if(dataIndex1 === dataIndex2){
                    this.setValueHelper(field, value);
                }
            }).createDelegate(this, [dataIndex, field], true), this);
            
            //如果是html编辑器则要监听sync事件
            if(field instanceof Ext.form.HtmlEditor){
                field.on('sync', (function(f, nv, dataIndex, model){                        
                    this.model.set(dataIndex, this.getValueHelper(f, nv));                        
                }).createDelegate(this, [dataIndex, this.model], 2), this);
            }else {
                //界面值发生变化修改模型上的值
                field.on('change', (function(f, nv, ov, dataIndex, model){                        
                    this.model.set(dataIndex, this.getValueHelper(f, nv));                        
                }).createDelegate(this, [dataIndex, this.model], 3), this);
            }
        }
    },
    
    //private
    updateFormFooter : function(){
        //左边
        var ffl = this.formFooterLeftConfig;
        if(ffl){
            var dataIndex = ffl.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(ffl, {
                    value : this.model.get(dataIndex)
                })
            }
            var leftPanel = this.formFooterLeftPanel
            if(leftPanel){
                if(leftPanel.rendered){
                    Ext.get(leftPanel.body).update(this.fieldTemplate.applyTemplate(ffl));
                }else {
                    leftPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(ffl));
                    }, this, {
                        single : true
                    })
                }
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, leftPanel, ffl){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(ffl, {
                            value : value
                        });
                        Ext.get(leftPanel.body).update(this.fieldTemplate.applyTemplate(ffl));
                    }
                }).createDelegate(this, [dataIndex, leftPanel, ffl], true), this);
            }
        }
        
        //中间
        var ffc = this.formFooterCenterConfig;
        if(ffc){
            var dataIndex = ffc.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(ffc, {
                    value : this.model.get(dataIndex)
                })
            }
            var centerPanel = this.formFooterCenterPanel
            if(centerPanel){
                if(centerPanel.rendered){
                    Ext.get(centerPanel.body).update(this.fieldTemplate.applyTemplate(ffc));
                }else {
                    centerPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(ffc));
                    }, this, {
                        single : true
                    })
                }
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, centerPanel, ffc){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(ffc, {
                            value : value
                        });
                        Ext.get(centerPanel.body).update(this.fieldTemplate.applyTemplate(ffc));
                    }
                }).createDelegate(this, [dataIndex, centerPanel, ffc], true), this);
            }
        }
        
        //右边
        var ffr = this.formFooterRightConfig;
        if(ffr){
            var dataIndex = ffr.dataIndex;
            if(Ext.isEmpty(dataIndex, false) == false){
                Ext.apply(ffr, {
                    value : this.model.get(dataIndex)
                })
            }
            var rightPanel = this.formFooterRightPanel
            if(rightPanel){
                if(rightPanel.rendered){
                    Ext.get(rightPanel.body).update(this.fieldTemplate.applyTemplate(ffr));
                }else {
                    rightPanel.on('render', function(panel){
                        Ext.get(panel.body).update(this.fieldTemplate.applyTemplate(ffr));
                    }, this, {
                        single : true
                    })
                }
                this.model.on('change', (function(model, dataIndex1, value, dataIndex2, rightPanel, ffr){
                    if(dataIndex1 === dataIndex2){
                        Ext.apply(ffr, {
                            value : value
                        });
                        Ext.get(rightPanel.body).update(this.fieldTemplate.applyTemplate(ffr));
                    }
                }).createDelegate(this, [dataIndex, rightPanel, ffr], true), this);
            }
        }
        
    },
    
    getModel : function(){
        return this.model;
    },
    
    //验证只读表达式
    evalReadOnlyExpression : function(expression, model){
        var result = null;
        try{
            eval('result = function(model){ return ' + expression + ';}(model);');
        }catch(e){}
        return result;
    }

});