(function(){
    
    tab3 = function(config){
        Rs.apply(this, config);
        tab3.superclass.constructor.call(this);
    };
    
    Rs.extend(tab3, Ext.Panel, {
        
        main : function(engine, region){
        
        },
        
        createInstance : function(){
            return new tab3({
            });
        }
        
    });
    
})();