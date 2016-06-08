Rs.ns("Rs.app");
(function(Rs) {

    /**
     * @class Rs.app.Engine
     * @extends Rs.util.Observable
     * Ӧ�ó�������,ͨ�����·�������Ӧ�ó�������
     * <pre><code>
        Rs.engine({
            
            shell : 'border', //shell ����
            
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
                    rid : 'north', // border���ͷֶ���������windowregion����ȱʡ��tab���ʹ���Ϊ'tab'
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
             * Ӧ�ó��������ʼ��֮ǰ�������¼�
             * @param {Rs.app.Engine} this
             */
            'beforeinitialized',
            
            /**
             * @event initialize
             * Ӧ�ó��������ʼ�����֮�󴥷����¼�
             * @param {Rs.app.Engine} this
             */
            'initialize',
            
            /**
             * @event importlibraries
             * ��������������ʱ�������¼�
             * @param {Rs.app.Engine} this
             * @param {Array} libraries
             */
            'importlibraries',
            
            /**
             * @event beforelaunch
             * ����������֮ǰ�������¼�
             * @param {Rs.app.Engine} this
             */
            'beforelaunch',
            
            /**
             * @event launch
             * ����������֮�󴥷����¼�
             * @param {Rs.app.Engine} this
             */
            'launch',
            
            /**
             * @event beforeinstall
             * ��װӦ�ó���֮ǰ�������¼�
             * @param {Rs.app.Engine} this
             * @param {Rs.app.Application} app
             * @param {Number} index
             */
            'beforeinstall',
            
            /**
             * @event install
             * ��װӦ�ó���֮�󴥷����¼�
             * @param {Rs.app.Engine} this
             * @param {Rs.app.Appliaction} app
             */
            'install',
            
            /**
             * @event beforestatesave
             * �����û�ƫ������֮ǰ�������¼�
             * @param {Rs.app.Engine} this
             * @param {Object} state
             */
            'beforestatesave',
            
            /**
             * @event statesave
             * �����û�ƫ����Ϣ֮�󴥷����¼�
             * @param {Rs.app.Engine} this
             * @param {Object} state
             */
            'statesave', 
            
            /**
             * @event themechange
             * ��ҳ����ʽ�����仯��ʱ�򴥷����¼�
             * @param {String} newTheme
             * @param {String} oldTheme
             */
            'themechange'
            );
    };

    Rs.extend(Rs.app.Engine, Rs.util.Observable, {
        
        //private
        initialized : false,
        
        //private �Ƿ��������
        launched : false,
        
        /**
         * @cfg {Boolean} autoLaunch
         * �Ƿ�������,Ĭ��ֵΪtrue
         */
        autoLaunch : true,
        
        /**
         * @cfg {Array} apps
         * Ӧ�ó����б�
         */
        
        /**
         * @cfg {String} theme
         * ϵͳҳ������,Ĭ����ʽΪblueǳ��ɫ,�����ѡ'grey'��'black'
         */
        theme : 'blue',
        
        /**
         * @cfg {Array} libraries
         * ������������, ������������ʱ����Ҫ����Rs.BASE_PATHΪ�������������Ŀ¼�ľ���·��
         * ���ÿ����'ext-3.3.1'��'ext-3.3.1-debug'��'jquery-1.5'��'jquery-1.5-debug'
         * eg : libraries : ['ext-3.3.1']
         */
        libraries : [],
        
        /**
         * @cfg {String} stateId
         * ҳ��ƫ����Ϣ�洢ID
         */
        
        /**
         * @cfg {Boolean} stateful
         * �Ƿ��Զ������û�ƫ������,Ĭ��ֵΪfalse,��ʾ���Զ������û�ƫ������
         */
        stateful : false,
        
        /**
         * @cfg {Array} stateEvents
         * �������¼�������ʱ���û���Ϣ����
         */
        
        /**
         * @cfg {Object} defaults
         * Ӧ�ó���Ĭ������
         */
        
        /**
         * @cfg {String/Object} environment 
         * Engine�����еĻ���,����Ϊ��������(development)�Ͳ�Ʒ����(production),Ĭ��Ϊ��Ʒ������
         * ���������ṩ�������е�����ָ����Ӵ��ڡ��÷����£�
         * <pre></code>
            enviroment : 'production'
            
            enviroment : {
                type : 'development',
                config : {
                    monitor : true, //�Ƿ�򿪼��������Ǳ���
                    clearCache : true //�Ƿ��Զ�������棬�Ǳ���
                }
            }
    
         * </code></pre>
         */
        environment : 'production',
        
        /**
         * @method setShell
         * ����shell
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
         * ��ȡshell
         * @method getShell
         */
        getShell : function(){
            var shell = this.shell;
            if(!shell){
                shell = {
                    type : 'window'
                };
            }else if(!shell.type){
                Rs.error('Shell����δ����');
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
         * ��ȡshell�Ŀ��
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
         * ��ȡ�û�ƫ�ô洢ID
         * @method getStateId
         * @return {String} stateId
         */
        getStateId : function(){
            return this.stateId;
        },

        /**
         * Ӧ�ó����������ڷ���,�ڸ�����Ĺ��췽���е��ø÷���
         * @method main
         * @return {Rs.app.Engine} this
         */
        main : function(){
            if(this.onBeforeMain(this) === false){
                return this;
            }
            //���shell����Ϊ�ַ���,����ת��Ϊobject����
            var shell = this.shell;
            if(Rs.isString(shell)){
                this.shell = {
                    type : shell
                };
            }
            //��ʼ�����л���
            this.initEnvironment(function(){
                //���������ƫ����Ϣ�������ȶ�ȡ�û�ƫ����Ϣ,
                //�ڻص���������������������
                if(this.stateful !== false){
                    this.initState(this.initEngine, this);
                }else {
                    //��ʼ����������
                    this.initEngine();
                }
            }, this);
            return this;
        },
        
        /**
         * ����ڳ�������ǰִ�и÷���,����÷�������false����ֹ���С�
         * 
         * @method onBeforeMain
         */
        onBeforeMain : Rs.emptyFn,
        
        /**
         * ��ʼ���������л���
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
                Rs.error('��δ����ĳ������л���:' + type);
            }
        },
        
        /**
         * ��ʼ���û�ƫ������
         * @method initState
         * @param {Function} callback �ص�����
         * @param {Object} scope �ص�����������
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
            
            //Ӧ�ó�������
            apps.each(function(app){
                if(app && app.installed === true){
                    appsState[app.getId()] = app.getState();
                }
            }, this);
            
            //��������
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
                //�޸�������ʽ
                if(this.theme != settingsState.theme){
                    this.theme = settingsState.theme;
                }
            }
        },
        
        /**
         * ��ȡ��������
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
         * ��ʼ������, ���ȼ�������Ҫ�ĵ��������libraries,
         * ��������ٹ���
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
                
                //�����ñ����û�ƫ����Ϣ���ʼ�������¼�����
                if(this.stateful !== false){
                    this.initStateEvents();
                }
                this.buildShell();
                this.fireEvent('initialize', this);
            }
        },
        
        /**
         * ��ʼ������ʱִ�и÷���,����÷�������false��ȡ����ʼ������
         * @method onBeforeInitialize
         * @param {Engine} engine
         */
        onBeforeInitialize : Rs.emptyFn,
        
        /**
         * ����shell
         * @method buildShell
         */
        buildShell : function(){
            this.setShell(this.getShell());
            if(this.shell){
                this.shell.build(this.el, this.onRebuildShell, this);
            }
        }, 
        
        /**
         * ����shell���,��������,������libraries
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
         * Ӧ������
         * @method applyTheme
         * @param {String} theme
         * @param {Function} callback �ص�����
         * param {Object} scope �ص�����������
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
                
                //ɾ��ԭ������ʽ
                oldThemeUrls = this.getThemeCssUrls(this.theme);
                Rs.each(oldThemeUrls, function(url){
                    Rs.removeResource(url);
                }, this);
                
                //������������ʽ
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
         * ��������
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
         * ������������֮ǰִ�и÷���,����÷�������false����ֹ����
         * @method onBeforeLaunch
         */
        onBeforeLaunch : Rs.emptyFn,
        
        /**
         * ��������,����װӦ�ó���
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
         * ϵͳ������Ϻ�ִ�и÷���
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
         * ��װӦ�ó���,��������Ϊ����,��ѭ��װ��ÿ��Ӧ�ó���
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
            //�������Ѿ�����ͬID��Ӧ�ó���װ,����򷵻�false,���������а�װ
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
         * ����װӦ�ó���֮ǰ���ø÷���,����÷�������false����ֹ��װ����
         * @method onBeforeInstall
         * @param {Application} app
         */
        onBeforeInstall : Rs.emptyFn,
        
        /**
         * ����������Ѿ���װ�ĸ�Ӧ�ó���ʵ��,���������������
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
         * ����Ӧ�ó���
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
         * ͨ��Ӧ�ó���ID��ȡӦ�ó���
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
 * ����engine
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
 * ��ȡengine
 * @class Rs
 * @method getAppEngine
 */
Rs.getAppEngine = function(){
    return Rs.appEngine;
};
