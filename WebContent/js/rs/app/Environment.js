(function() {
    
    //开发环境
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
        
        //监听
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
            
            //服务调用监听
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
                       name : '调用服务',
                       desc : o ? ('URL:' + url + ' METHOD:' + method) : ''
                    });
                }, this, {
                    single : true
                });
            }, this);
            
            //表格数据增删改查操作监听
            engine.on('install', this.onEngineAppInstall, this);
        },
        
        //private
        onEngineAppInstall : function(engine, app){
            var id = app.getId(),
                obj = app.getObj();
            
            //Ext表格
            if(obj instanceof Ext.grid.GridPanel){
                var store = obj.getStore();
                store.on('beforeload',  function() { //数据加载
                    var start = new Date();
                    store.on('load',function() {
                        var end = new Date();
                        story.push({
                           type : 'store',
                           start : start,
                           end : end,
                           name : '数据加载',
                           desc : 'APP:' + id
                        });
                    },this, {
                        single : true
                    });
                }, this);
                //数据保存
                store.on('beforesave', function(){
                    var start = new Date();
                    store.on('save', function(){
                        var end = new Date();
                        story.push({
                           type : 'store',
                           start : start,
                           end : end,
                           name : '数据更新',
                           desc : 'APP:' + id 
                        });
                    }, this, {
                       single : true 
                    });
                }, this);
            }
            
            //Ext组件渲染
            if(obj instanceof Ext.Component){
                obj.on('beforerender', function(){
                    var start = new Date();
                    obj.on('afterrender', function(){
                        var end = new Date();
                        story.push({
                           type : 'component',
                           start : start,
                           end : end,
                           name : '组件渲染',
                           desc : 'APP:' + id
                        });
                    }, this, {
                        single : true
                    });
                }, this);
            }
            
            //树加载资源
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
                                name : '树节加载',
                                desc : 'APP:' + id + ' NODE:' + (n.text || '')
                            });
                        }, this, {
                            single : true
                        });
                    }, this);
                }
            }
            
            //LittleEngine 组合应用程序
            if(obj instanceof Rs.app.LittleEngine){
                //启动
                obj.on('beforelaunch', function(){
                    var start = new Date();
                    obj.on('launch', function(){
                        var end = new Date();
                        story.push({
                            type : 'engine',
                            start : start,
                            end : end,
                            name : '组合程序',
                            desc : 'APP:' + id
                         });
                    }, this, {
                        single : true
                    });
                }, this);
                //程序安装
                obj.on('install', this.onEngineAppInstall, this);
            }
        }
    };

    
    
    //生产环境
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
     * 程序运行环境,现支持开发环境和产品环境两种。在开发环境用户可设置是否使用性能监视器。
     */
    Rs.app.Environment = (function() {

        return {

            development : DevEnvironment,

            production : ProEnvironment
        };

    })();
    
})();