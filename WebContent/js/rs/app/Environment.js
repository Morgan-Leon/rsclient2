(function() {
    
    //��������
    var DevEnvironment = function(config, callback, scope) {
        Rs.apply(this, config);
        this.init(callback, scope);
    };
    
    var story = [];
    
    DevEnvironment.prototype = {

        type : 'development',

        monitor : true,
        
        clearCache : true,
        
        interval : 1000,
        
        init : function(callback, scope) {
            if (this.monitor === true) {
                this.doMonitor();
            }
            if (Rs.isFunction(callback)) {
                callback.call(scope || this);
            }
        },
        
        //����
        doMonitor : function() {
            var engine = this.engine,
                storyboard,
                updater = (function() {
                    if (story.length > 20) {
                        story = story.slice(-20);
                    }
                    storyboard && storyboard.update(story);
                }).createDelegate(this),
                monitorAppCfg = {
                    folder : 'BUILDINS/monitor',
                    id : 'build-in_app_monitor',
                    autoRun : true,
                    region : {
                        x : 500,
                        y : 50,
                        width : 500,
                        height : 400,
                        minimizable : false, 
                        maximizable : false,
                        closable : false
                    }
                };
            
            if (engine.launched === true) {
                engine.install(monitorAppCfg, function(e, a) {
                    storyboard = a.getObj();
                    setInterval(updater, this.interval);
                }, this);
            } else {
                engine.apps.push(monitorAppCfg);
                var onInstall = function(e, a) {
                    var id = a.getId();
                    if (id == 'build-in_app_monitor') {
                        storyboard = a.getObj();
                        setInterval(updater, this.interval);
                        engine.un('install', onInstall, this);
                    }
                };
                engine.on('install', onInstall, this);
            }
            
            //������ü���
            Rs.Service.on('beforecall', function(s, o){
                var start = new Date(),
                    url = o ? o.url : '',
                    method = o ? o.method : '';
                Rs.Service.on('callcomplete', function(){
                    var end = new Date();
                    story.push({
                       type : 'service',
                       start : start,
                       end : end,
                       name : '���÷���',
                       desc : o ? ('URL:' + url + ' METHOD:' + method) : ''
                    });
                }, this, {
                    single : true
                });
            }, this);
            
            //���������ɾ�Ĳ��������
            engine.on('install', this.onEngineAppInstall, this);
        },
        
        //private
        onEngineAppInstall : function(engine, app){
            var id = app.getId(),
                obj = app.getObj();
            
            //Ext���
            if(obj instanceof Ext.grid.GridPanel){
                var store = obj.getStore();
                store.on('beforeload',  function() { //���ݼ���
                    var start = new Date();
                    store.on('load',function() {
                        var end = new Date();
                        story.push({
                           type : 'store',
                           start : start,
                           end : end,
                           name : '���ݼ���',
                           desc : 'APP:' + id
                        });
                    },this, {
                        single : true
                    });
                }, this);
                //���ݱ���
                store.on('beforesave', function(){
                    var start = new Date();
                    store.on('save', function(){
                        var end = new Date();
                        story.push({
                           type : 'store',
                           start : start,
                           end : end,
                           name : '���ݸ���',
                           desc : 'APP:' + id 
                        });
                    }, this, {
                       single : true 
                    });
                }, this);
            }
            
            //Ext�����Ⱦ
            if(obj instanceof Ext.Component){
                obj.on('beforerender', function(){
                    var start = new Date();
                    obj.on('afterrender', function(){
                        var end = new Date();
                        story.push({
                           type : 'component',
                           start : start,
                           end : end,
                           name : '�����Ⱦ',
                           desc : 'APP:' + id
                        });
                    }, this, {
                        single : true
                    });
                }, this);
            }
            
            //��������Դ
            if(obj instanceof Ext.tree.TreePanel){
                var loader = obj.getLoader();
                if(loader && loader instanceof Ext.tree.TreeLoader){
                    loader.on('beforeload', function(){
                        var start = new Date();
                        loader.on('load', function(l, n){
                            var end = new Date();
                            story.push({
                                type : 'treeloader',
                                start : start,
                                end : end,
                                name : '���ڼ���',
                                desc : 'APP:' + id + ' NODE:' + (n.text || '')
                            });
                        }, this, {
                            single : true
                        });
                    }, this);
                }
            }
            
            //LittleEngine ���Ӧ�ó���
            if(obj instanceof Rs.app.LittleEngine){
                //����
                obj.on('beforelaunch', function(){
                    var start = new Date();
                    obj.on('launch', function(){
                        var end = new Date();
                        story.push({
                            type : 'engine',
                            start : start,
                            end : end,
                            name : '��ϳ���',
                            desc : 'APP:' + id
                         });
                    }, this, {
                        single : true
                    });
                }, this);
                //����װ
                obj.on('install', this.onEngineAppInstall, this);
            }
        }
    };

    
    
    //��������
    var ProEnvironment = function(config, callback, scope) {
        Rs.apply(this, config);
        this.init(callback, scope);
    };

    ProEnvironment.prototype = {

        type : 'production',

        init : function(callback, scope) {
            if (Rs.isFunction(callback)) {
                callback.call(scope || this);
            }
        }

    };

    /**
     * @class Rs.app.Environment 
     * �������л���,��֧�ֿ��������Ͳ�Ʒ�������֡��ڿ��������û��������Ƿ�ʹ�����ܼ�������
     */
    Rs.app.Environment = (function() {

        return {

            development : DevEnvironment,

            production : ProEnvironment
        };

    })();
    
})();