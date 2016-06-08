Rs.define('Rs.ext.app.GeneralCardPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    displayMsg : '��ǰ��{1}��, ��{0}��',
    
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
        Ext.Msg.wait('���ڼ���...', '��ʾ');
        form.load(function(form){
            Ext.Msg.hide();
            //��ӱ����
            this.disabledExpressionCache = {};
            var panel = this.cardPanel = this.createCardPanel(form, formCode, formParams);
            this.add(panel);
            this.doLayout();
            
            //��������ģ��
            var modelCode = form.get('modelCode');
            this.modelContainer = new Rs.ext.app.Model({
                url: this.dataServiceUrl,
                loadMethod : 'getGeneralModel',
                data : {
                    formCode : formCode,//������
                    modelCode : modelCode,//ģ�ͱ���
                    cursor : 0, //��ǰλ��
                    formParams : formParams //�������
                }
            });
            Ext.Msg.wait('���ڼ���...', '��ʾ');
            this.modelContainer.load(this.onLoadGeneralModel, this);
        }, this);
    }, 
    
    //����ģ�ͷ����仯��ʱ��ִ�а�ť���ñ��ʽ
    onModelChangeEvalDisabledExpression : function(model){
        //��֤���ð�ť���ʽ
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
            //��һ����ť
            var prevBtn = this.prevBtn;
            if(!prevBtn){
                prevBtn = this.prevBtn = new Ext.Button({
                    text : '��һ��',
                    iconCls : 'rs-action-goleft',
                    scope : this,
                    handler : function(){
                        var c = this.modelContainer.get('cursor');
                        this.modelContainer.set('cursor', c-1);
                        Ext.Msg.wait('���ڼ���...', '��ʾ');
                        this.modelContainer.load(this.onLoadGeneralModel, this);
                    }
                });
                bbar.addButton(prevBtn);
            }
            prevBtn.setDisabled(cursor <= 0 ? true : false);
            
            //������ǩ
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
            
            //��һ����ť
            var nextBtn = this.nextBtn;
            if(!nextBtn){
                nextBtn = this.nextBtn = new Ext.Button({
                    text : '��һ��',
                    iconCls : 'rs-action-goright',
                    scope : this,
                    handler : function(){
                        var c = this.modelContainer.get('cursor');
                        this.modelContainer.set('cursor', c+1);
                        Ext.Msg.wait('���ڼ���...', '��ʾ');
                        this.modelContainer.load(this.onLoadGeneralModel, this);
                    }
                });
                bbar.addButton(nextBtn);
            }
            nextBtn.setDisabled(cursor >= total-1 ? true : false);
            
            //��ʾbbar
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
        
        //����
        var title = form.get('formName');
        if(Ext.isEmpty(title, false) == false){
            Ext.apply(config, {
                title : title
            })
        }
        
        //����
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
    
    //ִ�в���
    doAction : function(actionNo, actionType, callback, form, formCode, formParams){
        var cardPanel = this.cardPanel;
        
        var container = this.modelContainer;
        
        var model = new Rs.ext.app.Model({
            data : container.get('modelData') 
        });
        
        //ִ��һ����ť����
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
        
        //ִ�б��浱ǰ����ģ�Ͳ���
        var save = (function(callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var container = scope.modelContainer;
            Ext.Msg.wait('���ڽ���...', '��ʾ');
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
        
        //ɾ�����ݻ�����Ҫ���¼�������
        var clear = (function(callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var container = scope.modelContainer;
            Ext.Msg.wait('����ɾ��...', '��ʾ');
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
                    Ext.Msg.wait('���ڼ���...', '��ʾ');
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
        
        //ˢ�����ݻ�����Ҫ��������ʾ��ҳ����
        var load = (function(callback, scope){
            if(Ext.isFunction(callback) == false){
                scope = callback;
            }
            var container = scope.modelContainer;
            Ext.Msg.wait('���ڼ���...', '��ʾ');
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
        
        //ִ�з���
        var execFun = function(){
            var container = this.modelContainer;
            Ext.Msg.wait('���ڽ���...', '��ʾ');
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
                    title:'��ʾ',
                    msg: '��ȷ��Ҫɾ����������ɾ�����޷��ָ�!',
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
                    title:'��ʾ',
                    msg: '��ȷ��Ҫִ�иò�����!',
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
    
    //ִ���첽�����Ļص�����
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
    
    //��֤���ʽ
    evalDisabledExpression : function(expression, model){
        var result = null;
        try{
            eval('result = function(model){ return ' + expression + ';}(model);');
        }catch(e){}
        return result;
    }
    
});