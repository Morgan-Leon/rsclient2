Rs.define('Rs.ext.app.GeneralCardPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    displayMsg : '当前第{1}条, 共{0}条',
    
    constructor : function(config){
        
        var formCode = config.formCode;
        var formParams = config.formParams;
        var formEditable = config.formEditable === true;
        var dataServiceUrl = config.dataServiceUrl;
        
        Ext.apply(this, config);
        
        this.initGeneralForm(formCode, formParams);
        
        Ext.apply(config, {
            border : false,
            layout : 'fit'
        });
        Rs.ext.app.GeneralCardPanel.superclass.constructor.apply(this, arguments);
    }, 
    
    initGeneralForm : function(formCode, formParams){
        var form = new Rs.ext.app.Model({
            url: this.dataServiceUrl,
            loadMethod : 'getGeneralForm',
            data : {
                formCode : formCode
            }
        });
        Ext.Msg.wait('正在加载...', '提示');
        form.load(function(form){
            Ext.Msg.hide();
            //添加表单面板
            this.disabledExpressionCache = {};
            var panel = this.cardPanel = this.createCardPanel(form, formCode, formParams);
            this.add(panel);
            this.doLayout();
            
            //加载数据模型
            var modelCode = form.get('modelCode');
            this.modelContainer = new Rs.ext.app.Model({
                url: this.dataServiceUrl,
                loadMethod : 'getGeneralModel',
                data : {
                    formCode : formCode,//表单编码
                    modelCode : modelCode,//模型编码
                    cursor : 0, //当前位置
                    formParams : formParams //传入参数
                }
            });
            Ext.Msg.wait('正在加载...', '提示');
            this.modelContainer.load(this.onLoadGeneralModel, this);
        }, this);
    }, 
    
    //数据模型发生变化的时候执行按钮禁用表达式
    onModelChangeEvalDisabledExpression : function(model){
        //验证禁用按钮表达式
        for(var an in this.disabledExpressionCache){
            var cfg = this.disabledExpressionCache[an];
            if(cfg && cfg.btn && cfg.expression){
                var btn = cfg.btn;
                var exp = cfg.expression;
                var disabled = this.evalDisabledExpression(exp, model);
                if(Ext.isBoolean(disabled)){
                    btn.setDisabled(disabled);
                };
            }
        }
    },
    
    //private
    onLoadGeneralModel : function(container){
        Ext.Msg.hide();
        var modelData = container.get('modelData');
        if(modelData){
            var model = new Rs.ext.app.Model({
                data : container.get('modelData')
            });
            this.cardPanel.setModel(model);
            model.on('change', this.onModelChangeEvalDisabledExpression, this);
            this.onModelChangeEvalDisabledExpression(model);
        }
        var cursor = container.get('cursor');
        var total = container.get('total');
        if(total > 1){
            var bbar = this.cardPanel.getBottomToolbar();
            //上一条按钮
            var prevBtn = this.prevBtn;
            if(!prevBtn){
                prevBtn = this.prevBtn = new Ext.Button({
                    text : '上一条',
                    iconCls : 'rs-action-goleft',
                    scope : this,
                    handler : function(){
                        var c = this.modelContainer.get('cursor');
                        this.modelContainer.set('cursor', c-1);
                        Ext.Msg.wait('正在加载...', '提示');
                        this.modelContainer.load(this.onLoadGeneralModel, this);
                    }
                });
                bbar.addButton(prevBtn);
            }
            prevBtn.setDisabled(cursor <= 0 ? true : false);
            
            //总数标签
            var msgLabel = this.msgLabel;
            if(!msgLabel){
                msgLabel = this.msgLabel = new Ext.form.Label({
                    style : 'font-size:10px;'
                });
                bbar.add('->');
                bbar.add('-');
                bbar.add(msgLabel);
                bbar.add('-');
            }
            msgLabel.setText(String.format(this.displayMsg, total, cursor+1));
            
            //下一条按钮
            var nextBtn = this.nextBtn;
            if(!nextBtn){
                nextBtn = this.nextBtn = new Ext.Button({
                    text : '下一条',
                    iconCls : 'rs-action-goright',
                    scope : this,
                    handler : function(){
                        var c = this.modelContainer.get('cursor');
                        this.modelContainer.set('cursor', c+1);
                        Ext.Msg.wait('正在加载...', '提示');
                        this.modelContainer.load(this.onLoadGeneralModel, this);
                    }
                });
                bbar.addButton(nextBtn);
            }
            nextBtn.setDisabled(cursor >= total-1 ? true : false);
            
            //显示bbar
            if(bbar.hidden === true){
                bbar.show();
            }
        }else {
            var bbar = this.cardPanel.getBottomToolbar();
            if(bbar.hidden != true){
                bbar.hide();
            }
        }
    },
    
    //private
    createCardPanel : function(form, formCode, formParams){
        var regions = form.get('formRegions') || {};
        var lines = form.get('fieldLines') || [];
        
        var formHeader = {};
        var formBody = {
            formEditable : this.formEditable
        };
        var formFooter = {};
        
        if(typeof regions.headercenter === 'object'){
            var cfg = {};
            try{
                eval('cfg = ' + unescape(regions.headercenter.regionConfig));
            }catch(e){}
            delete regions.headercenter.regionConfig;
            Ext.apply(formHeader, {
                center : Ext.apply(regions.headercenter, cfg)
            });
        }
        if(typeof regions.headerbottom === 'object'){
            var cfg = {};
            try{
                eval(' cfg = ' + unescape(regions.headerbottom.regionConfig));
            }catch(e){}
            delete regions.headerbottom.regionConfig;
            Ext.apply(formHeader, {
                bottom : Ext.apply(regions.headerbottom, cfg)
            });
        }
        if(typeof regions.headerleft === 'object'){
            var cfg = {};
            try{
                eval(' cfg = ' + unescape(regions.headerleft.regionConfig));
            }catch(e){}
            delete regions.headerleft.regionConfig;
            Ext.apply(formHeader, {
                left : Ext.apply(regions.headerleft, cfg)
            });
        }
        if(typeof regions.headerright === 'object'){
            var cfg = {};
            try{
                eval(' cfg = ' + unescape(regions.headerright.regionConfig));
            }catch(e){}
            delete regions.headerright.regionConfig;
            Ext.apply(formHeader, {
                right : Ext.apply(regions.headerright, cfg)
            });
        }
        
        if(typeof regions.footerleft === 'object'){
            var cfg = {};
            try{
                eval(' cfg = ' + unescape(regions.footerleft.regionConfig));
            }catch(e){}
            delete regions.footerleft.regionConfig;
            Ext.apply(formFooter, {
                left : Ext.apply(regions.footerleft, cfg)
            });
        }
        if(typeof regions.footercenter === 'object'){
            var cfg = {};
            try{
                eval(' cfg = ' + unescape(regions.footercenter.regionConfig));
            }catch(e){}
            delete regions.footercenter.regionConfig;
            Ext.apply(formFooter, {
                center : Ext.apply(regions.footercenter, cfg)
            });
        }
        if(typeof regions.footerright === 'object'){
            var cfg = {};
            try{
                eval(' cfg = ' + unescape(regions.footerright.regionConfig));
            }catch(e){}
            delete regions.footerright.regionConfig;
            Ext.apply(formFooter, {
                right : Ext.apply(regions.footerright, cfg)
            });
        }
        var fields = [];
        Ext.each(lines, function(line){
            var temp = [];
            if(line && line.fields){
                Ext.each(line.fields, function(field){
                    
                    var cfg = {};
                    try{
                        eval(' cfg = ' + unescape(field.fieldConfig));
                    }catch(e){}
                    delete field.fieldConfig;
                    
                    temp.push(Ext.apply(field, cfg));
                }, this);
            }
            fields.push(temp);
        }, this);
        Ext.apply(formBody, {
            fields : fields
        });
        
        var config = {
            formHeader : formHeader,
            formBody : formBody,
            formFooter : formFooter,
            bbar : new Ext.Toolbar({
                hidden : true
            })
        };
        
        //标题
        var title = form.get('formName');
        if(Ext.isEmpty(title, false) == false){
            Ext.apply(config, {
                title : title
            })
        }
        
        //操作
        var actions = form.get('formActions') || [];
        if(actions.length > 0){
            var btns = [];
            Ext.each(actions, function(act){
                var an = act.actionNo;
                var at = act.actionType;
                var cb = act.callback;
                var de = act.disabledExpression;
                
                var btn = new Ext.Button({
                    text : act.actionName,
                    iconCls : act.iconCls,
                    tooltip : act.tooltip,
                    scope : this,
                    handler : this.doAction.createDelegate(this, [an, at, cb, form, formCode, formParams])
                });
                if(Ext.isEmpty(de, false) == false){
                    this.disabledExpressionCache[an] = {
                        expression : de,
                        btn : btn
                    };
                }
                btns.push(btn);
            }, this);
            Ext.apply(config, {
                tbar : btns
            })
        }
        
        return new Rs.ext.app.CardPanel(config);
    }, 
    
    //执行操作
    doAction : function(actionNo, actionType, callback, form, formCode, formParams){
        var cardPanel = this.cardPanel;
        
        var container = this.modelContainer;
        
        var model = new Rs.ext.app.Model({
            data : container.get('modelData') 
        });
        
        //执行一个按钮操作
        var action = (function(actionNo, callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var actions = form.get('formActions') || [];
            var actCfg = null;
            Ext.each(actions, function(act){
                if(act.actionNo == actionNo){
                    actCfg = act;
                    return false;
                }
            }, this);
            if(actCfg){
                var an = actCfg.actionNo;
                var at = actCfg.actionType;
                var cb = actCfg.callback;
                scope.doAction(an, at, function(cardPanel, container, model){
                    if(Ext.isFunction(callback)){
                        callback.call(scope, cardPanel, container, model);
                    }
                }, form, formCode, formParams);
            }else {
                if(Ext.isFunction(callback)){
                    callback.call(scope);
                }
            }
        }).createDelegate(this, [this], true);
        
        //执行保存当前数据模型操作
        var save = (function(callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var container = scope.modelContainer;
            Ext.Msg.wait('正在进行...', '提示');
            container.callService({
                method : 'doSaveAction',
                params : {
                    formCode : formCode,
                    formParams : formParams,
                    modelData : container.get('modelData')
                }
            }, function(result){
                Ext.Msg.hide();
                scope.doActionCallback(actionType, function(cardPanel, container, model, result){
                    if(Ext.isFunction(callback)){
                        callback.call(scope, cardPanel, container, model, result);
                    }
                }, form, formCode, formParams, cardPanel, container, model, result, 
                action, save, clear, load);
            }, scope);
        }).createDelegate(this, [this], true);
        
        //删除数据回来后要重新加载数据
        var clear = (function(callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var container = scope.modelContainer;
            Ext.Msg.wait('正在删除...', '提示');
            container.callService({
                method : 'doClearAction',
                params : {
                    formCode : formCode,
                    formParams : formParams,
                    modelData : container.get('modelData')
                }
            }, function(result){
                Ext.Msg.hide();
                if(result && result.SUCC == true){
                    Ext.Msg.wait('正在加载...', '提示');
                    container.load(function(container){
                        scope.onLoadGeneralModel(container);
                        scope.doActionCallback(actionType, function(cardPanel, container, model, result){
                            if(Ext.isFunction(callback)){
                                callback.call(scope, cardPanel, container, model, result);
                            }
                        }, form, formCode, formParams, cardPanel, container, model, result, 
                        action, save, clear, load);
                    }, scope);
                }else {
                    scope.doActionCallback(actionType, function(cardPanel, container, model, result){
                        if(Ext.isFunction(callback)){
                            callback.call(scope, cardPanel, container, model, result);
                        }
                    }, form, formCode, formParams, cardPanel, container, model, result, 
                    action, save, clear, load);
                }
            }, scope);
        }).createDelegate(this, [this], true);
        
        //刷新数据回来后要将数据显示在页面上
        var load = (function(callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var container = scope.modelContainer;
            Ext.Msg.wait('正在加载...', '提示');
            container.callService({
                method : 'doLoadAction',
                params : {
                    formCode : formCode,
                    formParams : formParams,
                    modelData : container.get('modelData')
                }
            }, function(result){
                Ext.Msg.hide();
                if(result && result.SUCC == true){
                    var data = result.DATA;
                    if(Ext.isObject(data)){
                        container.set('modelData', data);
                        var model = new Rs.ext.app.Model({
                            data : data
                        });
                        scope.cardPanel.setModel(model);
                    }
                    scope.doActionCallback(actionType, function(cardPanel, container, model, result){
                        if(Ext.isFunction(callback)){
                            callback.call(scope, cardPanel, container, model, result);
                        }
                    }, form, formCode, formParams, cardPanel, container, model, result, 
                    action, save, clear, load);
                }else {
                    scope.doActionCallback(actionType, function(cardPanel, container, model, result){
                        if(Ext.isFunction(callback)){
                            callback.call(scope, cardPanel, container, model, result);
                        }
                    }, form, formCode, formParams, cardPanel, container, model, result, 
                    action, save, clear, load);
                }
            }, scope);
        }).createDelegate(this, [this], true);
        
        //执行方法
        var execFun = function(){
            var container = this.modelContainer;
            Ext.Msg.wait('正在进行...', '提示');
            container.callService({
                method : 'doActionNo',
                params : {
                    formCode : formCode,
                    actionNo : actionNo,
                    formParams : formParams,
                    modelData : container.get('modelData')
                }
            }, function(result){
                Ext.Msg.hide();
                this.doActionCallback(actionType, callback,
                        form, formCode, formParams, cardPanel, container, model, result, 
                        action, save, clear, load);
            }, this);
        };
        
        if(actionType == 'javascript'){
            var result = {
                SUCC:true,
                MSG:''
            };
            this.doActionCallback(actionType, callback, 
                    form, formCode, formParams, cardPanel, container, model, result,
                    action, save, clear, load);
        }else {
            if(actionType == 'save'){
                save.call(this, function(cardPanel, container, model, result){
                    this.doActionCallback(actionType, callback, 
                            form, formCode, formParams, cardPanel, container, model, result,
                            action, save, clear, load);
                });
            }else if(actionType == 'clear'){
                Ext.MessageBox.show({
                    title:'提示',
                    msg: '您确定要删除该数据吗？删除后将无法恢复!',
                    buttons: Ext.Msg.YESNO,
                    scope : this,
                    fn: function(btn){
                        if(btn == 'yes'){
                            clear.call(this, function(cardPanel, container, model, result){
                                this.doActionCallback(actionType, callback, 
                                        form, formCode, formParams, cardPanel, container, model, result,
                                        action, save, clear, load);
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }else if(actionType == 'load'){
                load.call(this, function(cardPanel, container, model, result){
                    this.doActionCallback(actionType, callback, 
                            form, formCode, formParams, cardPanel, container, model, result,
                            action, save, clear, load);
                });
            }else if(actionType == 'exec'){
                Ext.MessageBox.show({
                    title:'提示',
                    msg: '您确定要执行该操作吗!',
                    buttons: Ext.Msg.YESNO,
                    scope : this,
                    fn: function(btn){
                        if(btn == 'yes'){
                            execFun.call(this);
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        }
    }, 
    
    //执行异步操作的回调方法
    doActionCallback : function(actionType, callback, form, formCode, formParams, 
            cardPanel, container, model, result, action, save, clear, load){
        if(Ext.isFunction(callback)){
            callback.call(this, cardPanel, container, model, result, action, save, clear, load);
        }else {
            try{
                eval('(function(cardPanel, container, model, result, action, save, clear, load){' 
                    + unescape(callback)
                    + "})(cardPanel, container, model, result, action, save, clear, load);");
            }catch(e){}
        }
    }, 
    
    //验证表达式
    evalDisabledExpression : function(expression, model){
        var result = null;
        try{
            eval('result = function(model){ return ' + expression + ';}(model);');
        }catch(e){}
        return result;
    }
    
});