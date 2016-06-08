(function(){
    
    tab2 = function(config){
        Rs.apply(this, config);
        tab2.superclass.constructor.call(this);
    };
    
    Rs.extend(tab2, Ext.Panel, {
        
        main : function(engine, region){
        
        },
        
        createInstance : function(){
            return new tab2({
            });
        }
        
    });
    
})();