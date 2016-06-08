Rs.define('rs.pub.GeneralFormPreviewPanel', {
    
    extend : Ext.Panel,
    
    constructor : function(config){

        var main = this.mainPanel = new Ext.Panel({
            border : false,
            layout : 'fit'
        });
        
        Ext.apply(config, {
            border : false,
            layout : 'fit',
            items : [main]
        });
        
        rs.pub.GeneralFormPreviewPanel.superclass.constructor.apply(this, arguments);
    }, 
    
    setGeneralForm : function(generalForm){
        this.generalForm = generalForm;
        
        var panel = this.cardPanel = this.createCardPanel(generalForm);
        
        var main = this.mainPanel;
        main.removeAll(true);
        main.add(panel);
        main.doLayout();
    }, 
    
    //private
    createCardPanel : function(generalForm){
        var regions = generalForm.get('formRegions') || {};
        var lines = generalForm.get('fieldLines') || [];
        
        var formHeader = {};
        var formBody = {};
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
            formFooter : formFooter
        }
        
        var formName = generalForm.get('formName');
        if(Ext.isEmpty(formName, false) == false){
            Ext.apply(config, {
                title : formName
            });
        }
        
        var actions = generalForm.get('formActions') || [];
        if(actions.length > 0){
            var btns = [];
            Ext.each(actions, function(act){
                var at = act.actionType;
                var cb = act.callback;
                
                btns.push({
                    text : act.actionName,
                    iconCls : act.iconCls,
                    tooltip : act.tooltip,
                    scope : this,
                    handler : this.doAction.createDelegate(this, [at, cb], true)
                })
            }, this);
            Ext.apply(config, {
                tbar : btns
            })
        }
        
        return new Rs.ext.app.CardPanel(config);
    }, 
    
    //Ö´ÐÐ²Ù×÷
    doAction : function(btn, e, actionType, callback){
        alert(actionType);
    }
    
});