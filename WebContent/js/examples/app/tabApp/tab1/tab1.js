(function(){
    
    tab1 = function(config){
        Rs.apply(this, config);
        tab1.superclass.constructor.call(this);
    };
    
    Rs.extend(tab1, Ext.Panel, {
        
        main : function(engine, region){
        
        },
        
        createInstance : function(){
            return new tab1({
            });
        }
        
    });
    
})();