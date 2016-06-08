Rs.define('rs.app.template.maintenance.DetailPanel', {
    
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            layout : 'border',
            //layoutConfig: {columns:1},
            items : [this.dhead = new rs.app.template.maintenance.DocumentHead({region:'north'}), 
                     this.dgrid = new rs.app.template.maintenance.DetailGrid({region:'center'})]
        });
        this.dhead.on('reset', this.resetData, this);
        rs.app.template.maintenance.DetailPanel.superclass.constructor.call(this, config);
        
        Rs.EventBus.on('maintainpanel-modify', this.setData, this);
        Rs.EventBus.on('maintainpanel-add', this.resetData, this);
    },
    
    setData : function(rec){
        if(this.rendered){
            this.showData(rec);
        } else{
            this.on('render', this.showData.createDelegate(this,[rec]), this);
        }
    },
    
    resetData : function(){
        if(this.rendered){
            this.dhead.resetData();
            this.dgrid.resetData();
        } else{
            this.on('render', this.resetData, this);
        }
    },
    
    showData : function(rec){
        this.dhead.setData(rec);
        this.dgrid.setData(rec.get('receive_no'));
    }
    
});