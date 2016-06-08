Rs.define('rs.demo.grid.QueryGrid', {
    
    extend : Rs.ext.grid.GeneralselPanel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        var conditions = [{
            dataIndex : 'A.ORDER_NO',
            header : '¶©µ¥ºÅ',
            hidden : false,
            editor : new Ext.form.TextField( {
                allowBlank : false
            })
        }, {
            dataIndex : 'A.SEQ_NO',
            header : '¶©µ¥ÐÐºÅ',
            hidden : false,
            editor : new Ext.form.TextField( {})
        } ];
        
        var qp = new Rs.ext.query.QueryPanel( {
            width : 1000,
            height : 100,
            region : 'north',
            collapsible : true,
            collapsed : false,
            hideCollapseTool : true,
            collapseMode : "mini",
            split : true,
            conditions : conditions
        });
        
        config = Rs.apply(config || {}, {
            queryPanel : qp,
            queryPanelCollapsed : false,
            progCode : 'RSC2_ordDetail1',
            progCondition : 'a.company_code = \'00\''
        });
        rs.demo.grid.QueryGrid.superclass.constructor.call(this, config);
    }
});