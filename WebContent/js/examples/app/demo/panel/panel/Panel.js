Rs.define('rs.demo.panel.Panel', {
   
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            html : '��ͨ���'
        });
        rs.demo.panel.Panel.superclass.constructor.call(this, config);
    }

});