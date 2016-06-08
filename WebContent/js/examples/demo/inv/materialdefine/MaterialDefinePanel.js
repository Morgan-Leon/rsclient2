Rs.define('rs.inv.MaterialDefinePanel', {

    extend: Ext.Panel,

    mixins: [Rs.app.Main],

    constructor: function(config) {
        var grid = new rs.inv.MaterialDefineGrid({
            region: 'center'
        });
        var query = new rs.inv.MaterialDefineQuery({
            region: 'north',
            split : true,
            collapseMode : "mini",
            animCollapse : false,
            grid: grid
        });
        config = Rs.apply(config || {},
        {
            layout: 'border',
            title : '物料定义' ,
            items: [grid, query]

        });
        rs.inv.MaterialDefinePanel.superclass.constructor.call(this, config);
    }
});