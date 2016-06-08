Rs.define('rs.pm.PacPmOrder', {

    extend: Rs.ext.grid.GeneralselPanel,
    
    mixins: [Rs.app.Main],
    
    constructor: function(config){
    
        config = Rs.apply(config ||
        {}, {
            progCode: 'PacPmOrder',
            tbar: []
        });
        
        rs.pm.PacPmOrder.superclass.constructor.call(this, config);
        
    },
    
    initComponent: function(){
    
        rs.pm.PacPmOrder.superclass.initComponent.apply(this, arguments);
        
        this.topToolbar.addButton(new Rs.ext.grid.ExportButton({
            grid: this.grid,
            filename: "нд╪Ч"
        }));
        
    }
});
