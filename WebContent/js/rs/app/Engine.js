Rs.ns("Rs.app");
(function(Rs) {

    /**
     * @class Rs.app.Engine
     * @extends Rs.util.Observable
     * 应用程序引擎,通过以下方法创建应用程序引擎
     * <pre><code>
        Rs.engine({
            
            shell : 'border', //shell 类型
            
            onBeforeInitEngine : function(){
                Rs.BASE_PATH = '/rs/js/rs';
            },
            
            libraries : ['ext-3.3.1'],
            
            apps : [{
                folder : 'gridPanel',
                region : 'center'
            }, {
                folder : 'queryPanel',
                region : {
                    rid : 'north', // border类型分东南西北，windowregion此项缺省，tab类型此项为'tab'
                    height : 200,
                    collapsible : true,
                    collapsed : false,
                    minHeight : 100,
                    maxHeight : 300
                }
            }]
        });

     * </code></pre>
     * @constructor
     * @param {Object} config
     */
    Rs.app.Engine = function(config) {
        
        config = config || {};
        
        this.initialConfig = config;
        
        Rs.apply(this, config);
        
        Rs.app.Engine.superclass.constructor.call(this);
        
        this.addEvents(
            /**
             * @event beforeinitialized
             * 应用程序引擎初始化之前触发该事件
             * @param {Rs.app.Engine} this
             */
            'beforeinitialized',
            
            /**
             * @event initialize
             * 应用程序引擎初始化完毕之后触发该事件
             * @param {Rs.app.Engine} this
             */
            'initialize',
            
            /**
             * @event importlibraries
             * 当引入第三方类库时触发该事件
             * @param {Rs.app.Engine} this
             * @param {Array} libraries
             */
            'importlibraries',
            
            /**
             * @event beforelaunch
             * 启动该引擎之前触发该事件
             * @param {Rs.app.Engine} this
             */
            'beforelaunch',
            
            /**
             * @event launch
             * 启动该引擎之后触发该事件
             * @param {Rs.app.Engine} this
             */
            'launch',
            
            /**
             * @event beforeinstall
             * 安装应用程序之前触发该事件
             * @param {Rs.app.Engine} this
             * @param {Rs.app.Application} app
             * @param {Number} index
             */
            'beforeinstall',
            
            /**
             * @event install
             * 安装应用程序之后触发该事件
             * @param {Rs.app.Engine} this
             * @param {Rs.app.Appliaction} app
             */
            'install',
            
            /**
             * @event beforestatesave
             * 保存用户偏好设置之前触发该事件
             * @param {Rs.app.Engine} this
             * @param {Object} state
             */
            'beforestatesave',
            
            /**
             * @event statesave
             * 保存用户偏好信息之后触发该事件
             * @param {Rs.app.Engine} this
             * @param {Object} state
             */
            'statesave', 
            
            /**
             * @event themechange
             * 当页面样式发生变化的时候触发该事件
             * @param {String} newTheme
             * @param {String} oldTheme
             */
            'themechange'
            );
    };

    Rs.extend(Rs.app.Engine, Rs.util.Observable, {
        
        //private
        initialized : false,
        
        //private 是否启动标记
        launched : false,
        
        /**
         * @cfg {Boolean} autoLaunch
         * 是否自启动,默认值为true
         */
        autoLaunch : true,
        
        /**
         * @cfg {Array} apps
         * 应用程序列表
         */
        
        /**
         * @cfg {String} theme
         * 系统页面主题,默认样式为blue浅蓝色,另外可选'grey'和'black'
         */
        theme : 'blue',
        
        /**
         * @cfg {Array} libraries
         * 引入第三方框架, 引入第三方框架时候需要设置Rs.BASE_PATH为第三方框架所在目录的绝对路径
         * 可用框架有'ext-3.3.1'，'ext-3.3.1-debug'，'jquery-1.5'和'jquery-1.5-debug'
         * eg : libraries : ['ext-3.3.1']
         */
        libraries : [],
        
        /**
         * @cfg {String} stateId
         * 页面偏好信息存储ID
         */
        
        /**
         * @cfg {Boolean} stateful
         * 是否自动保存用户偏好设置,默认值为false,表示不自动保存用户偏好设置
         */
        stateful : false,
        
        /**
         * @cfg {Array} stateEvents
         * 当以下事件触发的时候将用户信息保存
         */
        
        /**
         * @cfg {Object} defaults
         * 应用程序默认配置
         */
        
        /**
         * @cfg {String/Object} environment 
         * Engine所运行的环境,可以为开发环境(development)和产品环境(production),默认为产品环境。
         * 开发环境提供程序运行的性能指标监视窗口。用法如下：
         * <pre></code>
            enviroment : 'production'
            
            enviroment : {
                type : 'development',
                config : {
                    monitor : true, //是否打开监视器，非必需
                    clearCache : true //是否自动清除缓存，非必需
                }
            }
    
         * </code></pre>
         */
        environment : 'production',
        
        /**
         * @method setShell
         * 设置shell
         * @param {Rs.app.Shell} shell
         */
        setShell : function(shell){
            if(this.shell && this.shell != shell){
                this.shell.setEngine(null);
            }
            this.shell = shell;
            shell.setEngine(this);
            this.relayEventsByPrefix(shell, 'shell', ['build', 'resize']);
        },
        
        /**
         * 获取shell
         * @method getShell
         */
        getShell : function(){
            var shell = this.shell;
            if(!shell){
                shell = {
                    type : 'window'
                };
            }else if(!shell.type){
                Rs.error('Shell类型未定义');
            }
            if(!(shell instanceof Rs.app.Shell)){
                shell = this.shell = new Rs.app.SHELL[shell.type.toLowerCase()](shell);
            }
            return shell;
        },
        
        getXY : function(){
            return [0, 0];
        },
        
        /**
         * 获取shell的宽高
         * @method getSize
         * @return {Object} obj
         */
        getSize : function(){
            var D = Rs.lib.Dom,
                w = D.getViewWidth(false),    
                h = D.getViewHeight(false);
            return {
                width : w,
                height : h
            };
        },
        
        /**
         * 获取用户偏好存储ID
         * @method getStateId
         * @return {String} stateId
         */
        getStateId : function(){
            return this.stateId;
        },

        /**
         * 应用程序引擎的入口方法,在该引擎的构造方法中调用该方法
         * @method main
         * @return {Rs.app.Engine} this
         */
        main : function(){
            if(this.onBeforeMain(this) === false){
                return this;
            }
            //如果shell属性为字符串,则将其转换为object配置
            var shell = this.shell;
            if(Rs.isString(shell)){
                this.shell = {
                    type : shell
                };
            }
            //初始化运行环境
            this.initEnvironment(function(){
                //如果定义了偏好信息保存则先读取用户偏好信息,
                //在回调方法中再启动程序引擎
                if(this.stateful !== false){
                    this.initState(this.initEngine, this);
                }else {
                    //初始化程序引擎
                    this.initEngine();
                }
            }, this);
            return this;
        },
        
        /**
         * 当入口程序运行前执行该方法,如果该方法返回false则终止运行。
         * 
         * @method onBeforeMain
         */
        onBeforeMain : Rs.emptyFn,
        
        /**
         * 初始化引擎运行环境
         * @method initEnvironment
         * @param {Function} callback
         * @param {Object} scope 
         */
        initEnvironment : function(callback, scope){
            var ENV = Rs.app.Environment,
                env = this.environment,
                environment,
                type, cfg;
            if(Rs.isObject(env)){
                type = env.type;
                cfg = Rs.isObject(env.config) ? env.config : {};
            }else if(Rs.isString(env)){
                type = env;
            }
            if(ENV.hasOwnProperty(type)){
                this.environment = new ENV[type](Rs.apply(cfg || {}, {
                    engine : this
                }), callback, scope);
            }else {
                Rs.error('尚未定义的程序运行环境:' + type);
            }
        },
        
        /**
         * 初始化用户偏好设置
         * @method initState
         * @param {Function} callback 回调方法
         * @param {Object} scope 回调方法作用域
         */
        initState : function(callback, scope){
            var id = this.getStateId(),
                StateManager = Rs.app.StateManager,
                doCallback = function(){
                    if(Rs.isFunction(callback)){
                        callback.call(scope || this);
                    }
                };
            if(StateManager && id){
                StateManager.load(id, function(state){
                    this.stateData = state;
                    this.applySetting();
                    doCallback();
                }, this);
           }else {
               doCallback();
           }
        },
        
        // private
        initStateEvents : function(){
            if(this.stateEvents){
                for(var i = 0, e; e = this.stateEvents[i]; i++){
                    this.on(e, this.saveState, this, {
                        scope : this,
                        delay : 100,
                        buffer : 200
                    });
                }
            }
        },
        
        // private
        getState : function(){
            var apps = this.apps,
                appsState = {}, settings;
            
            //应用程序设置
            apps.each(function(app){
                if(app && app.installed === true){
                    appsState[app.getId()] = app.getState();
                }
            }, this);
            
            //引擎设置
            settings = Rs.apply({}, {
                theme : this.theme
            });
            return {
                apps : appsState,
                settings : settings
            };
        },
        
        // private
        saveState : function(){
            var StateManager = Rs.app.StateManager;
            if(StateManager && this.stateful !== false){
                var id = this.getStateId();
                if(id){
                    var state = this.getState();
                    if(this.fireEvent('beforestatesave', this, state) !== false){
                        StateManager.sync(id, state);
                        this.fireEvent('statesave', this, state);
                    }
                }
            }
        },
        
        //private
        applySetting : function(){
            var stateData = this.stateData,
                settingsState = stateData ? stateData.settings : undefined;
            if(settingsState){
                //修改主题样式
                if(this.theme != settingsState.theme){
                    this.theme = settingsState.theme;
                }
            }
        },
        
        /**
         * 获取引擎容器
         * @method getContainer
         * @return {Rs.Element} container
         */
        getContainer : function(){
           var container = this.container;
           if(!container){
               container = this.container = Rs.getBody();
           }
           return container; 
        },
        
        /**
         * 初始化引擎, 首先加载所需要的第三方框架libraries,
         * 加载完后再构建
         * @method initEngine
         */
        initEngine : function() {
            if(!this.initialized && this.fireEvent('beforeinitialized', this) !== false 
                && this.onBeforeInitialize(this) !== false){
                this.container = this.getContainer();
                this.el = this.container.createChild({
                    tag : 'div',
                    cls : 'rs-engine'
                });
                this.initialized = true;
                
                //当设置保存用户偏好信息后初始化保存事件监听
                if(this.stateful !== false){
                    this.initStateEvents();
                }
                this.buildShell();
                this.fireEvent('initialize', this);
            }
        },
        
        /**
         * 初始化引擎时执行该方法,如果该方法返回false则取消初始化引擎
         * @method onBeforeInitialize
         * @param {Engine} engine
         */
        onBeforeInitialize : Rs.emptyFn,
        
        /**
         * 构建shell
         * @method buildShell
         */
        buildShell : function(){
            this.setShell(this.getShell());
            if(this.shell){
                this.shell.build(this.el, this.onRebuildShell, this);
            }
        }, 
        
        /**
         * 构建shell完毕,启动引擎,并引入libraries
         * @method onRebuildShell
         */
        onRebuildShell : function(){
            this.importLibraries(function(){
                this.applyTheme(this.theme, function(){
                    if(this.autoLaunch === true){
                        this.launch();
                    }
                }, this);
            }, this);
        }, 
        
        /**
         * 应用主题
         * @method applyTheme
         * @param {String} theme
         * @param {Function} callback 回调方法
         * param {Object} scope 回调方法作用域
         */
        applyTheme : function(theme, callback, scope){
            var Themes = Rs.Themes,
                oldThemeUrls, newThemeUrls;
            if(Themes && Rs.isArray(Themes[theme])){
                var oldTheme = this.theme,
                    onApplyFn = (function(){
                        this.fireEvent('themechange', this, theme, oldTheme);
                        if(Rs.isFunction(callback)){
                            callback.apply(this, arguments);
                        }
                    }).createDelegate(this);
                
                //删除原主题样式
                oldThemeUrls = this.getThemeCssUrls(this.theme);
                Rs.each(oldThemeUrls, function(url){
                    Rs.removeResource(url);
                }, this);
                
                //引入新主题样式
                newThemeUrls = this.getThemeCssUrls(theme);
                this.importFileList(newThemeUrls, onApplyFn, scope);
                
                this.theme = theme;
            }else {
                if(Rs.isFunction(callback)){
                    callback.call(scope || this);
                }
            }
        },
        
        //private
        getThemeCssUrls : function(theme){
            var Themes = Rs.Themes,
                list = [];
            if(Themes && Rs.isArray(Themes[theme])){
                var libs = this.libraries,
                    Libraries = Rs.Libraries, lib,
                    list = [].concat(Themes[theme]),
                    BASE_PATH = Rs.BASE_PATH;
                Rs.each(libs, function(v){
                    lib = Libraries[v];
                    if(lib){
                        list = list.concat(lib.getTheme(theme) || []);
                    }
                }, this);
                for(var i = 0, len = list.length; i < len; i++){
                    list[i] = BASE_PATH + '/' + list[i]; 
                }
            }
            return list;
        },
        
        //load libs file
        importLibraries : function(callback, scope){
            var libs = this.libraries,
                Libraries = Rs.Libraries, lib,
                list = [],
                BASE_PATH = Rs.BASE_PATH;
            Rs.each(libs, function(v){
                lib = Libraries[v];
                if(lib){
                    list = list.concat(lib.css || [], lib.js || []);
                }
            }, this);
            for(var i = 0, len = list.length; i < len; i++){
                list[i] = BASE_PATH + '/' + list[i]; 
            }
            this.importFileList(list, callback, scope);
        },
        
        //private
        importFileList : function(list, callback, scope){
            var url = list.shift();
            if(url){
                Rs.lr(url, this.goOnImportFile.createDelegate(this, 
                        [this.importFileList, list, callback, scope], false), this);
            }else {
                this.fireEvent('importlibraries', this, this.libraries);
                Ext.BLANK_IMAGE_URL = Rs.BASE_PATH + "/lib/ext-3.3.1/resources/images/default/s.gif" ;
                callback.call(scope || this, this);
            }
        },
        
        //private
        goOnImportFile : function(fun, list, callback, scope){
            fun.call(this, list, callback, scope);
        },
        
        /**
         * 启动引擎
         * @method launch
         * @return {Rs.app.Engine}
         */
        launch : function(){
            if(!this.launched 
                    && this.fireEvent('beforelaunch', this) !== false
                    && this.onBeforeLaunch() !== false){
                this.launched = true;
                this.onLaunch();
                this.fireEvent('launch', this);
                this.onAfterLaunch();
            }
            return this;
        },
        
        /**
         * 当启动该引擎之前执行该方法,如果该方法返回false则终止启动
         * @method onBeforeLaunch
         */
        onBeforeLaunch : Rs.emptyFn,
        
        /**
         * 启动引擎,并安装应用程序
         * @method onLaunch
         */
        onLaunch : function(){
            var apps = this.apps;
            if(apps){
                delete this.apps;
                this.install(apps);
            }
        },
        
        /**
         * 系统启动完毕后执行该方法
         * @method onAfterLaunch
         */
        onAfterLaunch : Rs.emptyFn,
        
        //private
        getAppId : function(app){
            return app.getId();
        },

        //private
        initApps : function(){
            if(!this.apps){
                this.apps = new Rs.util.MixedCollection(false, this.getAppId);
            }
        },
        
        /**
         * 安装应用程序,如果传入的为数组,则循环装入每个应用程序
         * @method install
         * @param {Array/Object} app
         * @param {Function} callback (optional)
         * @param {Object} scope (optional)
         * @return {Array} app
         */
        install : function(apps, callback, scope){
            this.initApps();
            if(Rs.isArray(apps)){
                var result = [];
                Rs.each(apps, function(a){
                    result.push(this.install(a, callback, scope));
                }, this);
                return result;
            }
            //检查如果已经有相同ID的应用程序安装,则程序返回false,不继续进行安装
            var a = this.createApp(this.applyDefaults(apps)),
                index = this.apps.length,
                callbackFn = function(succ, app){
                    if(Rs.isFunction(callback)){
                        callback.call(scope || this, succ, app);
                    }
                };
            if(this.fireEvent('beforeinstall', this, a, index) !== false 
                    && this.onBeforeInstall(a) !== false){
                var shell = this.shell, 
                    region = shell.getRegion(a.getRegionId());
                a.onInstall(this, region, index, function(succ, app){
                    if(succ === true){
                        this.onInstall(app, region);
                    }else {
                        app = undefined; delete app;
                    }
                    callbackFn(succ, app);
                }, this);
            }
            return a;
        },
        
        /**
         * 当安装应用程序之前调用该方法,如果该方法返回false则终止安装程序
         * @method onBeforeInstall
         * @param {Application} app
         */
        onBeforeInstall : Rs.emptyFn,
        
        /**
         * 如果不存在已经安装的该应用程序实例,则将其添加入引擎中
         * @method onInstall
         * @param {Rs.app.Application} app,
         * @param {Rs.app.Region} region
         */
        onInstall : function(app, region){
            if(!this.apps.contains(app)){
                this.fireEvent('install', this, app);
                this.relayEventsByPrefix(app, 'app', ['resize', 'move']);
                this.applyAppState(app);
                this.apps.add(app);
                this.shell.reBuild(app.getRegion(), app);
            }
        },
        
        //private
        applyAppState : function(app){
            var stateData = this.stateData,
                appsState = stateData ? stateData.apps : undefined;
            if(appsState){
                var id = app.getId();
                app.applyState(appsState[id] || {});
            }
        },
        
        /**
         * 创建应用程序
         * @method createApp
         * @param {Object} config
         * @return {Rs.app.Application}
         */
        createApp : function(config){
            return new Rs.app.Application(config, this);
        },
        
        //private
        applyDefaults : function(app){
            var d = this.defaults;
            if(d){
                if(Rs.isFunction(d)){
                    d = d.call(this, app);
                }else {
                    var dd = {};
                    for(var k in d){
                        dd[k] = Rs.apply({}, d[k]);
                    }
                    Rs.apply(app, dd);
                }
            }
            return app;
        },
        
        /**
         * 通过应用程序ID获取应用程序
         * @method getAppById
         * @param {String} appId
         * @return {Rs.app.Application}
         */
        getAppById : function(appId){
            return Rs.app.AppMgr.get(appId);
        }, 
        
        //private
        relayEventsByPrefix : function(o, prefix, events){
            var me = this;
            function createHandler(ename){
                return function(){
                    return me.fireEvent.apply(me, [ename].concat(Array.prototype.slice.call(arguments, 0)));
                };
            }
            for(var i = 0, len = events.length; i < len; i++){
                var ename = events[i],
                    ename2 = prefix + ename;
                me.events[ename2] = me.events[ename2] || true;
                o.on(ename, createHandler(ename2), me);
            }
        }
        
    });

})(Rs);

/**
 * 创建engine
 * @class Rs
 * @method engine
 */
Rs.engine = function(config, callback, scope) {
    Rs.onReady(function(){
        Rs.appEngine = new Rs.app.Engine(config).main();
        if(Rs.appEngine && Rs.isFunction(callback)){
            callback.call(scope || this, Rs.appEngine);
        }
    }, this);
};

/**
 * 获取engine
 * @class Rs
 * @method getAppEngine
 */
Rs.getAppEngine = function(){
    return Rs.appEngine;
};
