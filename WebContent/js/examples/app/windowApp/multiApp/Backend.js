(function() {

    var engine = Rs.getAppEngine(),
        
        count = 0, keyWord,
        
        queryCallBack = function(tree, kw){
            if(keyWord == kw){
                count++;
            }else {
                keyWord = kw;
                count = 0;
            }
            if(count == 3){
                alert('�淳~ ����' + keyWord + '��ѯ��' + count + '����');
                count = 0;
            }
        },
        
        onAppOpen = function(app){
            Rs.EventBus.on('tree-query', queryCallBack, this);
        }, 
        
        onAppClose = function(){
            Rs.EventBus.un('tree-query', queryCallBack, this);
            count = 0;
            keyWord = undefined;
        };
    
    engine.on('install', function(engine, app) {
        var id = app.getId();
        if(id == 'multi_app'){
            app.on('open', onAppOpen, this);
            app.on('close', onAppClose, this);
        }
    }, this, {
        single : true,
        scope : this
    });

})();