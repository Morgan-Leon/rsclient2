Rs.define('rs.buildins.theme.Theme', {

    extend : Ext.Panel,
    
    mixins : [ Rs.app.Main ],

    constructor : function(config) {

        var store = new Ext.data.ArrayStore( {
            fields : [ 'theme', 'name' ],
            data : [ [ 'blue', '默认' ], [ 'access', '蓝黑色' ], [ 'gray', '浅灰' ],
                    [ 'black', '黑色' ], [ 'blue03', '蓝色2' ], [ 'brown', '棕色' ],
                    [ 'brown02', '棕色2' ], [ 'green', '绿色' ], [ 'pink', '粉色' ],
                    [ 'purple', '紫色' ], [ 'red03', '红色' ] ]
        });

        var combo = this.combo = new Ext.form.ComboBox( {
            store : store,
            displayField : 'name',
            valueField : 'theme',
            typeAhead : true,
            mode : 'local',
            forceSelection : true,
            triggerAction : 'all',
            emptyText : '请选择主题',
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
                text : '应用',
                scope : this,
                handler : this.applyTheme
            }, {
                text : '取消',
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
