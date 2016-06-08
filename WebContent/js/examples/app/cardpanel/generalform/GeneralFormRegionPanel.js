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
                text : '����',
                tooltip : '���浱ǰѡ�п�Ƭ��������Ϣ',
                iconCls : 'rs-action-save',
                scope : this,
                handler : this.saveFormRegion
            }, {
                text : '���',
                tooltip : 'ɾ����ǰѡ�п�Ƭ��������Ϣ',
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
    
    //���ñ�λ����Ϣ
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
    
    //�������
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
            
            //��¼��ť����
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
            return '����';
        }else if(formRegion == 'headerbottom'){
            return '������';
        }else if(formRegion == 'headerleft'){
            return '���ҳü';
        }else if(formRegion == 'headerright'){
            return '�Ҳ�ҳü';
        }else if(formRegion == 'footerleft'){
            return '���ҳ��';
        }else if(formRegion == 'footercenter'){
            return '�м�ҳ��';
        }else if(formRegion == 'footerright'){
            return '�Ҳ�ҳ��';
        }
    },
    
    //�����
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
                    fieldLabel : '�ֶ�',
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
                    fieldLabel : '��ǩ',
                    maxLength : 30,
                    columnWidth: .3
                }, {
                    dataIndex : 'value',
                    fieldLabel : 'ֵ',
                    maxLength : 100,
                    columnWidth: .4
                }], [{
                    dataIndex : 'color',
                    fieldLabel : '��ɫ',
                    maxLength : 30,
                    columnWidth: .3
                }, {
                    xtype : 'numberfield',
                    dataIndex : 'fontSize',
                    fieldLabel : '�ֺ�',
                    maxLength : 10,
                    columnWidth: .3
                }], [{
                    xtype : 'textarea',
                    dataIndex : 'regionConfig',
                    fieldLabel : '��չ����',
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
                    fieldLabel : 'ע',
                    value : '��չ���Ա�����JSON��ʽ��д������<span style="color:blue;">{</span>��ʼ����<span style="color:blue;">}</span>��β��'
                }
            }
        });
        return new Rs.ext.app.CardPanel(config);
    }, 
    
    //��ʾĳλ��
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
            
            //��ǰ����״̬��ť
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
    
    //����
    saveFormRegion : function(){
        if(this.regionMainPanel.fieldValidate()){
            var model = this.regionMainPanel.getModel();
            Ext.Msg.wait('���ڱ���...', '��ʾ');
            model.save(function(result){
                Ext.Msg.hide();
                if(result != true){
                    Ext.Msg.alert('��ʾ', result);
                }else {
                    var fr = model.get('formRegion');
                    this.formRegion.set(fr, model.getData());
                }
            }, this);
        }
    },
    
    //���
    clearFormRegion : function(){
        Ext.Msg.show({
            title:'��ʾ',
            msg: '��ȷ��Ҫ�����ѡ�е�����������?������޷��ָ�',
            buttons: Ext.Msg.YESNO,
            icon: Ext.MessageBox.QUESTION,
            scope : this,
            fn: function(btn){
                if(btn == 'yes'){
                    var model = this.regionMainPanel.getModel();
                    Ext.Msg.wait('�������...', '��ʾ');
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