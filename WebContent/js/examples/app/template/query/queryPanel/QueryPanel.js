Rs.define('rs.app.query.QueryPanel',{
    
    extend :  Rs.ext.query.QueryPanel,
    
    mixins : [ Rs.app.Main ],
    
    constructor : function(config) {
    
        var conditions = [{
            dataIndex : 'code',
            header : 'code',
            width : 80,
            hidden : false,
            editor : new Ext.form.TextField( {
                allowBlank : false
            })
        }, {
            dataIndex : 'name',
            header : 'name',
            width : 80,
            hidden : false,
            editor : new Ext.form.TextField( {})
        } ];
        
        config = Rs.apply(config || {}, {
            conditions : conditions
        });

        rs.app.query.QueryPanel.superclass.constructor.call(this, config);

        Rs.EventBus.register(this, 'querypanel', ['query']);
        Rs.EventBus.register(this, 'querypanel', ['reset']);
    }
});