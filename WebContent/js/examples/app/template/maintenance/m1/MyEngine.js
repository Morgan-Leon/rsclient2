Rs.engine({
    
    shell : 'border',
    
    onBeforeInitialize : function() {
        Rs.BASE_PATH = '/rsc/js/rs';
    },
    
    //libraries : ['ext-3.3.1-debug'],
    
    apps : [{
        folder : 'dimTree',
        id : 'dimtree',
        clearCache : true,
        region : {
            rid : 'west',
            width : 200,
            collapsible : true
        }}, {
        folder : 'infoArea',
        clearCache : true,
        id : 'infoarea',
        region : 'center'},
     {
        folder : 'dimAdd',
        id : 'dimadd',
        clearCache : true,
        region : {
            rid : 'east',
            width : 220,
            collapsible : true
        }}]
});