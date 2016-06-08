Rs.define('rs.pub.GeneralFormRegionPanel', {
    
    extend : Ext.Panel,
    
    constructor : function(config){
        
        var nav = this.getNavPanel({
            region : 'west',
            margins : '5 2 5 5',
            width : 100
        });
        
        var main = this.regionMainPanel = this.getMainPanel({
            region : 'center',
            border : true,
            margins : '5 5 5 2',
            tbar : [{
                text : '保存',
                tooltip : '保存当前选中卡片的设置信息',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.saveFormRegion
            }, {
                text : '清除',
                tooltip : '删除当前选中卡片的设置信息',
                iconCls : 'rs-action-delete',
                scope : this,
                handler : this.clearFormRegion
            }]
        });
        
        Ext.apply(config, {
            layout : 'border',
            border : false,
            items : [nav, main]
        });
        
        rs.pub.GeneralFormRegionPanel.superclass.constructor.apply(this, arguments);
    },
    
    //设置表单位置信息
    setFormRegion : function(formRegion){
        this.formRegion = formRegion;
        if(this.rendered){
            this.showFormRegionConfig('headercenter');    
        }else {
            this.on('render', function(){
                this.showFormRegionConfig('headercenter');
            }, this, {
                single : true,
                delay : 100
            })
        }
    },
    
    //导航面板
    getNavPanel : function(config){
        
        this.navButtons = {};
        
        var items = [];
        Ext.each([{
            border : false,
            formRegion : 'headercenter',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('headercenter') +'</div>'
        }, {
            border : false,
            formRegion : 'headerbottom',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('headerbottom') +'</div>'
        }, {
            border : false,
            formRegion : 'headerleft',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('headerleft') +'</div>'
        }, {
            border : false,
            formRegion : 'headerright',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('headerright') +'</div>'
        }, {
            border : false,
            formRegion : 'footerleft',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('footerleft') +'</div>'
        }, {
            border : false,
            formRegion : 'footercenter',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('footercenter') +'</div>'
        }, {
            border : false,
            formRegion : 'footerright',
            html : '<div class="generalform-btn">'
                + this.getFormRegionName('footerright') +'</div>'
        }], function(config){
            var panel = new Ext.Panel(config);
            panel.on('render', function(){
                panel.getEl().on('click', function(el){
                    this.showFormRegionConfig(config.formRegion);
                }, this);
            }, this);
            items.push(panel);
            
            //记录按钮个数
            this.navButtons[config.formRegion] = panel;
        }, this);
        
        Ext.apply(config, {
            layout : 'fit',
            items : [{
                xtype : 'panel',
                border : false,
                autoScroll : true,
                bodyStyle : 'padding-left:10px;padding-top:20px;',
                items : items
            }]
        });
        return new Ext.Panel(config);
    }, 
    
    //private
    getFormRegionName : function(formRegion){
        if(formRegion == 'headercenter'){
            return '标题';
        }else if(formRegion == 'headerbottom'){
            return '副标题';
        }else if(formRegion == 'headerleft'){
            return '左侧页眉';
        }else if(formRegion == 'headerright'){
            return '右侧页眉';
        }else if(formRegion == 'footerleft'){
            return '左侧页脚';
        }else if(formRegion == 'footercenter'){
            return '中间页脚';
        }else if(formRegion == 'footerright'){
            return '右侧页脚';
        }
    },
    
    //主面板
    getMainPanel : function(config){
        Ext.apply(config, {
            formHeader : {
                center : {
                    fontSize : 24,
                    dataIndex : 'formRegionName'
                }
            },
            formBody : {
                fields : [[{
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
                            +  ' model_code = \'' + panel.formRegion.get('modelCode') + '\'';
                    }).createDelegate(this, [this], true),
                    columnWidth: .3
                }, {
                    dataIndex : 'fieldLabel',
                    fieldLabel : '标签',
                    maxLength : 30,
                    columnWidth: .3
                }, {
                    dataIndex : 'value',
                    fieldLabel : '值',
                    maxLength : 100,
                    columnWidth: .4
                }], [{
                    dataIndex : 'color',
                    fieldLabel : '颜色',
                    maxLength : 30,
                    columnWidth: .3
                }, {
                    xtype : 'numberfield',
                    dataIndex : 'fontSize',
                    fieldLabel : '字号',
                    maxLength : 10,
                    columnWidth: .3
                }], [{
                    xtype : 'textarea',
                    dataIndex : 'regionConfig',
                    fieldLabel : '扩展属性',
                    height : 355,
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
                    value : '扩展属性必须以JSON格式编写，并以<span style="color:blue;">{</span>开始，以<span style="color:blue;">}</span>结尾。'
                }
            }
        });
        return new Rs.ext.app.CardPanel(config);
    }, 
    
    //显示某位置
    showFormRegionConfig : function(regionName){
        
        var nb = this.navButtons[regionName];
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
            
            var formCode = this.formRegion.get('formCode');
            var data = this.formRegion.get(regionName) || {};
            var model = new Rs.ext.app.Model({
                url: GENERALFORM_DATASERVICE,
                saveMethod : 'saveFormRegion',
                clearMethod : 'clearFormRegion',
                data : Ext.apply({
                    formCode : formCode,
                    formRegion : regionName,
                    formRegionName : this.getFormRegionName(regionName)
                }, data)
            });
            this.regionMainPanel.setModel(model);
        }
    }, 
    
    //保存
    saveFormRegion : function(){
        if(this.regionMainPanel.fieldValidate()){
            var model = this.regionMainPanel.getModel();
            Ext.Msg.wait('正在保存...', '提示');
            model.save(function(result){
                Ext.Msg.hide();
                if(result != true){
                    Ext.Msg.alert('提示', result);
                }else {
                    var fr = model.get('formRegion');
                    this.formRegion.set(fr, model.getData());
                }
            }, this);
        }
    },
    
    //清除
    clearFormRegion : function(){
        Ext.Msg.show({
            title:'提示',
            msg: '您确定要清除所选中的设置内容吗?清除后将无法恢复',
            buttons: Ext.Msg.YESNO,
            icon: Ext.MessageBox.QUESTION,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = this.regionMainPanel.getModel();
                    Ext.Msg.wait('正在清除...', '提示');
                    model.clear(function(result){
                        Ext.Msg.hide();
                        if(result == true){
                            model.each(function(k, v){
                                if(k != 'formCode' 
                                    && k != 'formRegion' 
                                        && k != 'formRegionName'){
                                    model.set(k, undefined);
                                }
                            }, this);
                        }
                    }, this);
                }
            }
        });
    }
    
});