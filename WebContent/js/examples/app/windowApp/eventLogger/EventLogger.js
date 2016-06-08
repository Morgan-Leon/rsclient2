Rs.define('rs.acct.EventLogger', {
   
    extend : Ext.Panel,
    
    mixins : [Rs.app.Main],
    
    config : {
        counter : 0,
        message : ''
    },
    
    constructor : function(config){
        config = Rs.apply(config || {}, {
            autoScroll : true
        });
        rs.acct.EventLogger.superclass.constructor.call(this, config);
        var BUS = Rs.EventBus;
        BUS.fireEvent = BUS.fireEvent.createInterceptor(this.logger, this);
    }, 
    
    logger : function(e, el){
        this.message += (this.counter++) + ' : ' +  e + ' ' + el + '<br/>';
        if(this.isVisible()){
            this.update(this.message);
        }
    }
   
});