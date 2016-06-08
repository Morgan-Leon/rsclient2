Rs.define('rs.app.query.GeneralselPanel',{
    
    extend :  Rs.ext.grid.GeneralselPanel,
    
    mixins : [ Rs.app.Main ],
    
    constructor : function(config) {
    
        config = Rs.apply(config || {}, {
                progCode : 'invVendor',
                pageSize : 100,
                progCondition : ' company_code = \'00\'',
                queryPanelCollapsed : false
        });

        rs.app.query.GeneralselPanel.superclass.constructor.call(this, config);
    }
});