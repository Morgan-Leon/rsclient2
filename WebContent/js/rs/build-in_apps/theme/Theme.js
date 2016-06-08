Rs.define('rs.buildins.theme.Theme', {

    extend : Ext.Panel,
    
    mixins : [ Rs.app.Main ],

    constructor : function(config) {

        var store = new Ext.data.ArrayStore( {
            fields : [ 'theme', 'name' ],
            data : [ [ 'blue', 'Ĭ��' ], [ 'access', '����ɫ' ], [ 'gray', 'ǳ��' ],
                    [ 'black', '��ɫ' ], [ 'blue03', '��ɫ2' ], [ 'brown', '��ɫ' ],
                    [ 'brown02', '��ɫ2' ], [ 'green', '��ɫ' ], [ 'pink', '��ɫ' ],
                    [ 'purple', '��ɫ' ], [ 'red03', '��ɫ' ] ]
        });

        var combo = this.combo = new Ext.form.ComboBox( {
            store : store,
            displayField : 'name',
            valueField : 'theme',
            typeAhead : true,
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '��ѡ������',
            selectOnFocus : true,
            width : 100,
            listeners : {
                change : {
                    fn : function(combo, theme, oldTheme) {
                       
                    },
                    scope : this
                }
            }
        });
        
        config = Rs.apply(config || {}, {
            layout : 'fit',
            frame : false,
            tbar : [ combo, '->', {
                iconCls : 'rs-action-apply',
                text : 'Ӧ��',
                scope : this,
                handler : this.applyTheme
            }, {
                text : 'ȡ��',
                iconCls : 'rs-action-cancel',
                scope : this,
                handler : this.cancelApply
            } ],
            items : [{
                border : false,
                bodyCfg: {
                    tag: 'div',
                    cls: 'theme-blue-image'
                }
            }]
        });
        
        rs.buildins.theme.Theme.superclass.constructor.call(this, config);
    }, 
    
    applyTheme : function(){
        var engine = Rs.appEngine,
            theme = this.combo.getValue();

        engine.applyTheme(theme, function() {
            
        }, this);
    },

    cancelApply : function(){
        
    }
    
});
