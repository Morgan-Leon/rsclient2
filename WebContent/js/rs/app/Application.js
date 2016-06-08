Rs.ns("Rs.app");

(function() {
    
    /**
     * @class Rs.app.Application
     * @extends Rs.util.Observable
     * 应用程序类。
     * 应用程序描述文件示例:
     * <pre><code>
        R = (function() {

            return {
                id : 'app_store',
                name : '应用商店',
                icon16 : 'app-store-icon16',
                js : ['AppStore.js'],
                css : ['css/main.css'],
                objCfg : 'rs.acct.AppStore'
            };
        
        })(); 
     * </code></pre>
     * 应用程序创建方法如下:
     * <pre><code>
        Rs.define('tab1', {

            config : {
                html : '窗口'
            },
        
            constructor : function(config) {
                this.initConfig(config);
            },
        
            mixins : [ Rs.app.Main ]
        
        });
     * </code></pre>
     * @constructor
     * @param config
     * @param engine
     */
    Rs.app.Application = function(config, engine) {
        
        config = config || {};
        Rs.apply(this, config);
        this.engine = engine;
        
        Rs.app.Application.superclass.constructor.call(this);
        
        this.addEvents(
            /**
             * @event loadresfile
             * 当加载完该应用程序的资源文件后触发该事件
             * @param {Rs.app.Application} this
             */
            'loadresfile',
            
            /**
             * @event beforeinstall
             * 当安装该应用程序之前触发该事件,如果该事件监听着返回false则终止安装
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             * @param {Number} index
             */
            'beforeinstall',
            
            /**
             * @event install
             * 当该应用程序安装完成后触发该事件
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             */
            'install',
            
            /**
             * @event installfailed
             * 当该应用程序安装失败后触发该事件
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             */
            'installfailed',
            
            /**
             * @event beforeshow
             * 当应用程序显示之前触发该事件,如果该事件的回调方法返回false则终止显示该应用程序
             * @param {Rs.app.Application} this
             */
            'beforeopen',
            
            /**
             * @event show
             * 当应用程序显示的时候触发该事件
             * @param {Rs.app.Application} this
             */
            'open',
            
            /**
             * @event beforeclose
             * 当应用程序关闭之前触发该事件,如果该事件的回调方法返回false则终止关闭
             * @param {Rs.app.Application} this
             */
            'beforeclose',
            
            /**
             * @event close
             * 当应用程序关闭之后执行该方法
             * @param {Rs.app.Application} this
             */
            'close'
        );
        
        //region is an object 
        var r = this.region;
        if(Rs.isObject(r)){
            this.regionId = r.rid;
            this.regionCfg = Rs.apply(this.regionCfg || {}, r);;
            delete this.region;
        }else if(Rs.isString(r)){
            this.regionId = r;
            delete this.region;
        }
    };

    Rs.extend(Rs.app.Application, Rs.util.Observable, {
        
        /**
         * @cfg {String} id
         * 应用程序唯一ID
         */
        
        /**
         * @cfg {String} name
         * 应用程序名称
         */
        
        /**
         * @cfg {String} icon8
         * 应用程序图标 8*8, 默认值为'rs-app-default-icon8'
         */
        
        /**
         * @cfg {String} icon16
         * 应用程序图标 16*16, 默认值为'rs-app-default-icon16'
         */
        
        
        /**
         * @cfg {String} icon32
         * 应用程序图标 32*32, 默认值为'rs-app-default-icon32'
         */
        
        /**
         * @cfg {object} region
         * 程序位置配置信息
         */
        
        /**
         * @cfg {String} folder
         * 应用程序所在文件夹路径，如果应用程序为内置程序，可简单配置为 BUILDINS/app_folder。 
         */
        
        /**
         * @cfg {String} objCfg 
         * 应用程序obj对象配置属性
         * <pre><code>
         * objCfg : {
         *     cfg : {}, //构造参数,默认值为{}
         *     clazz : 'AcctTree', //obj类名, 必输参数
         *     main : 'main', //应用程序入口方法,默认值为main,该方法传入参数为固定的engine 和 region
         *     provider : 'createInstance', //对象创建方法,该方法返回一个obj对象
         *     release : 'relaase' //程序关闭时释放方法,非必须参数 
         * }
         * 
         * objCfg : 'AcctTree' //只声明类名,main provider 使用默认值
         * </code></pre>
         */
        
        /**
         * @cfg {Boolean} autoRun
         * 程序是否自动运行
         */
        autoRun : false,
        
        //private
        running : false,
        
        /**
         * @cfg {Array} js
         * JS文件名字列表,相对folder文件夹的位置。
         */
        
        /**
         * @cfg {Array} css
         * app特有CSS样式表文件列表,相对folder文件夹的位置
         */
        
        //private  资源文件是否加载完成
        resFileLoaded : false,
        
        //private
        installed : false,
        
        /**
         * @cfg {String} resFileName
         * 应用程序描述文件名称
         */
        resFileName : 'R.js',
        
        // private 加载应用程序描述文件
        loadResFile : function(callback, scope){
            if(this.resFileLoaded !== true){
                var folder = this.getRealFolder(),
                    src = folder + "/" + this.resFileName;
                Rs.lr(src, function(){
                    if(R){
                        this.resFileLoaded = true;
                        this.resFileConfig = R;
                        Rs.applyIf(this, R);
                        this.fireEvent('loadresfile', this, R);
                        R = null;
                    }else {
                        Rs.error(src + ' file error!');
                    }
                    if(Rs.isFunction(callback)){
                        callback.call(scope || this, this);
                    }
                }, this, this.engine.environment.clearCache? true : false);//this.clearCache? true : false);
            }else {
                if(Rs.isFunction(callback)){
                    callback.call(scope || this, this);
                }
            }
        },
        
        /**
         * 获取应用程序ID
         * @method getId
         * @return {String} id
         */
        getId : function(){
            return this.id;
        },
        
        /**
         * 获取该应用程序所在文件夹路径
         * @method getFolder
         * @return {String} folder
         */
        getFolder : function(){
            return this.folder;
        },
        
        /**
         * 对于内置应用程序,配置其folder 属性为 BUILDINS/app_folder
         * 通过该方法可获取实际的文件夹路径
         * @method getRealFolder
         * @return {String} readFolder
         */
        getRealFolder : function(){
            var folder = this.folder;
            if(folder.length > 9 && folder.substr(0, 9) == 'BUILDINS/'){
                folder = Rs.BASE_PATH + '/build-in_apps/' + folder.substr(9);
            }
            return folder;
        },
        
        
        /**
         * 获取应用程序名称
         * @method getName
         */
        getName : function(){
           return this.name; 
        },
        
        /**
         * 获取应用程序图标8*8
         * @method getIcon8
         */
        getIcon8 : function(){
            return this.icon8 || 'rs-app-default-icon8';
        },
        
        /**
         * 获取应用程序图标16*16
         * @method getIcon16
         */
        getIcon16 : function(){
            return this.icon16 || 'rs-app-default-icon16';
        },
        
        /**
         * 获取应用程序图标32*32
         * @method getIcon32
         */
        getIcon32 : function(){
            return this.icon23 || 'rs-app-default-icon23';
        },
        
        /**
         * 获取应用程序位置ID
         * @method getRegionId
         * @return {String} the id of region
         */
        getRegionId : function(){
            return this.regionId;
        },
        
        /**
         * 获取应用程序位置配置信息
         * @method getRegionCfg
         * @return {Object} regionCfg 
         */
        getRegionCfg : function(){
            return Rs.apply({}, this.regionCfg);
        },
        
        /**
         * 获取该应用程序安装后的位置
         * @method getRegion
         * @return {Region} region
         */
        getRegion : function(){
            return this.region;
        },
        
        //private
        loadRes : function(callback, scope){
            var js = this.js || [],
                css = this.css || [];
            this.loadResList([].concat(css, js), callback, scope);
        },
        
        //private
        loadResList : function(list, callback, scope){
            var file = list.shift();
            if(file){
                var folder = this.getRealFolder(),
                    src = folder + "/" + file;
                Rs.lr(src, this.goOnLoadResFile.createDelegate(this, 
                        [this.loadResList, list, callback, scope], false), this, this.engine.environment.clearCache? true : false);
            }else {
                this.fireEvent('loadresfile', this, this.js, this.css);
                callback.call(scope || this, this);
            }
        },
        
        //private
        goOnLoadResFile:function(fun, list, callback, scope){
            fun.call(this, list, callback, scope);
        },
        
        /*
         * 安装该应用程序之前执行该方法,如果该方法返回false则终止安装
         */
        onBeforeInstall : Rs.emptyFn,
        
        /**
         * 应用程序安装,如果当前对象所在文件夹下应用程序的其他实例,则不再加载资源文件,
         * 如果存在相同ID的改应用程序实例,则当前应用程序实例销毁,返回原有的实例.
         * @method onInstall
         * @param {Engine} engine
         * @param {Region} region
         * @param {Number} index
         * @param {Function} callback 回调方法,执行该回调方法时传入参数为succ, succ为true表示安装成功
         * @param {Objecat} scope
         */
        onInstall : function(engine, region, index, callback, scope) {
            if(!this.installed && this.fireEvent('beforeinstall', engine, this, region, index)
                    && this.onBeforeInstall(engine, this, region, index) !== false){
                var apps = Rs.app.AppMgr.getAppsByFolder(this.folder) || [], 
                    len = apps.length,
                    installFn = function(app, engine, region, callback, scope){
                        //当ResFile文件加载完毕之后，将该应用程序注册到应用程序管理类中
                        Rs.app.AppMgr.add(app);
                        app.doInstall(engine, region, callback, scope);
                    };
                if(len > 0){
                    //如果存在该文件夹下的应用程序的实例,则取其一，
                    //将其从应用程序描述文件(R.js)中获取的配置信息
                    //应用当前对象
                    Rs.applyIf(this, apps[0].resFileConfig);
                    //判断是否存在和当前对象ID相同的应用程序实例
                    //如果存在则终止安装,执行回调方法的时候传入参
                    //数为安装成功标记和已经安装的相同ID的应用程序实例
                    var id = this.getId(), i, app;
                    for(i = 0; i < len; i++){
                        app = apps[i];
                        if(app && app.getId() == id){
                            if(Rs.isFunction(callback)){
                                callback.call(scope || this, true, app);
                            }
                            return ;
                        }
                    }
                    if(i == len){
                        installFn(this, engine, region, callback, scope);
                    }
                }else {
                    //不存在该文件夹下的应用程序实例,
                    //加载该文件夹下的应用程序描述文件(R.js)
                    this.loadResFile(function(){
                        //加载该应用程序的资源文件(css & js)
                        this.loadRes(function(){
                            installFn(this, engine, region, callback, scope);
                        }, this);
                    }, this);
                }
            }
        },
        
        //安装应用程序
        doInstall : function(engine, region, callback, scope){
            var onDoInstall = function(succ, app){
                if(Rs.isFunction(callback)){
                    callback.call(scope || this, succ, succ ? app : undefined);
                }
            }, succ = true;
            try{
                this.engine = engine;
                this.region = region;
                this.relayEvents(region, ['resize', 'move']);
                if(this.autoRun === true){
                    this.run();
                }
                this.installed = true;
                this.fireEvent('install', engine, this, region);
                region.applyApp(this);
            }catch(e){
                succ = false;
                Rs.error('安装应用程序失败');
                this.fireEvent('installfailed', engine, this, region);
            };
            onDoInstall(succ, this);
        },
        
        /**
         * 获取obj对象配置参数
         * @method getObjCfg
         * @return {Object} objCfg
         */
        getObjCfg : function(){
            var objCfg = this.objCfg;
            if(Rs.isString(objCfg)){
                objCfg = {
                    clazz : objCfg
                };
            }
            return Rs.apply({
                cfg : {},
                main : 'main'/*,
                provider : 'createInstance'*/
            }, objCfg);
        },
        
        /**
         * 获取应用程序对象
         * @method getObj
         * @return {Object} obj
         */
        getObj : function(){
            var obj = this.obj;
            if(!obj){
                var objCfg = this.getObjCfg(),
                    cfg = objCfg.cfg,
                    clazz = objCfg.clazz/*, provider = objCfg.provider*/; 
                
                obj = this.obj = Rs.create(clazz, cfg);
                //obj = this.obj = eval(clazz + '.prototype.' + provider + '(cfg)');
            }
            return obj;
        },
        
        /**
         * 应用程序运行之前执行该方法，如果该方法返回false则终止执行
         * @method onBeforeRun
         * @return {Boolean}
         */
        onBeforeRun : Rs.emptyFn,
        
        /**
         * 运行应用程序,成功返回true，反之则返回false
         * @method run
         * @return {Boolean}
         */
        run : function(){
            var engine = this.engine;
            //确保该应用程序已经具有obj
            if(this.running != true && this.getObj() 
                && this.fireEvent('beforerun', engine, this)
                && this.onBeforeRun(engine, this) !== false){
                try{
                    //运行该应用程序的入口方法
                    region = this.region;
                    this.obj[this.getObjCfg().main](engine, region, this);
                    this.running = true;
                    this.fireEvent('run', engine, this);
                    return true;
                }catch(e){
                    Rs.error('运行应用程序发生异常');
                    return false;
                }
            }
            return false;
        },
        
        /**
         * 关闭程序之前执行该方法,如果该方法返回false则终止关闭
         * @method onBeforeShut
         * @return {Boolean} bool
         */
        onBeforeShut : Rs.emptyFn,
        
        /**
         * 关闭应用程序,成功返回true，反之则返回false
         * @method shut
         * @return {Boolean}
         */
        shut : function(){
            var engine = this.engine;
            if(this.running == true && this.getObj()
                    && this.fireEvent('beforeshut', engine, this)
                    && this.onBeforeShut(engine, this) !== false){
                try{
                    //运行应用程序关闭方法
                    var release = this.getObjCfg().release;
                    if(release && Rs.isString(release) 
                        && Rs.isFunction(this.obj[release])){
                        this.obj[release](engine, region, this);
                    }
                    this.running = false;
                    this.fireEvent('shut', engine, this);
                    return true;
                }catch(e){
                    Rs.error('关闭应用程序发生异常');
                    return false;
                }
            }else {
                return false;
            }
        },
        
        /**
         * 显示应用程序窗口或展开面板之前执行该方法,如果该方法返回false则取消打开
         * 在显示应用程序之前必须确保其已经执行 
         * @method onBeforeOpen
         */
        onBeforeOpen : Rs.emptyFn,
        
        /**
         * 显示应用程序窗口或展开面板
         * 在region的applyApp方法中实例该方法
         * @method show
         * @param {Boolean} behind 是否打开应用程序面板,当传入参数为true时才后台运行,
         * 如果是border类型的shell表示是否展开东西南北方向上的面板,如果是window或tab
         * 类型的shell,则表示是否打开窗口.
         */
        open : function(behind){
            var region = this.region;
            if(region && this.fireEvent('beforeopen', this) !== false
                && this.onBeforeOpen(this, region) !== false){
                //如果当前应用程序尚未启动则启动该应用程序
                if(this.running !== true){
                    this.run();
                }
                if(behind !== true){
                    //打开应用程序面板
                    region.open();
                    this.fireEvent('open', this);
                }else {
                    //不打开应用程序面板
                    this.fireEvent('behindopen', this);
                }
                this.openFlag = true;
                this.afterOpen();
            }
        },
        
        /**
         * 打开该应用程序之后执行该方法
         * @method afterOpen
         */
        afterOpen : Rs.emptyFn,
        
        /**
         * 关闭应用程序窗口或合并面板之前执行该方法,如果该方法返回false则取消关闭
         * @method onBeforeClose
         */
        onBeforeClose : Rs.emptyFn,
        
        /**
         * 关闭应用程序窗口或合并面板
         * 在region的applyApp方法中实例该方法
         * @method close
         */
        close : function(){
            var region = this.region;
            if(region && this.fireEvent('beforeclose', this) 
                && this.onBeforeClose() !== false){
                //如果应用程序正在运行,则关闭该应用程序
                if(this.running == true){
                    this.shut();
                }
                //关闭应用程序面板
                region.close();
                this.openFlag = false;
                this.fireEvent('close', this);
                this.afterClose();
            }
        },
        
        /**
         * 关闭应用程序之后执行该方法
         * @method afterClose
         */
        afterClose : Rs.emptyFn, 
        
        /**
         * 判断该应用程序是否正在运行
         * @method isOpen
         * @return {Boolean}
         */
        isOpen : function(){
            return this.openFlag === true;
        }, 
        
        /**
         * 获取应用程序状态信息,并将其保存到后台服务器,
         * @method getState
         * @return {Object} state
         */
        getState : function(){
            var state = {},
                region = this.getRegion();
            if(region){
                Rs.apply(state, {
                    region : region.getState()
                });
            }
            return  state;
        },
        
        /**
         * 应用程序偏好信息
         * @method applyState
         */
        applyState : function(state){
            //修改应用程序配置信息
            
            
            //修改应用程序位置信息
            var region = this.getRegion(),
                regionCfg = state && state.region ? state.region : undefined;
            if(region && Rs.isFunction(region.applyState) && regionCfg){
                this.on('open', function(){
                    region.applyState(regionCfg);
                }, this, {
                   scope : this,
                   single : true
                });
            }
        }
        
    });

    /**
     * 应用程序管理类
     * @class Rs.app.AppMgr
     * @constructor
     */
    Rs.app.AppMgr = function(){
        
        var keyFn = function(app){
            return app.getId();
        };
        
        var all = new Rs.util.MixedCollection(false, keyFn);

        return {
            
            /**
             * 添加应用程序
             * @method add 
             */
            add : function(app){
                all.add(app);
            },
            
            /**
             * 获取应用程序
             * @method get
             * @param {String} id 应用程序id
             * @return {Rs.app.Application}
             */
            get : function(id){
                return all.get(id);
            },
            
            /**
             * 删除应用程序
             * @method remove
             */
            remove : function(app){
                all.remove(app);
            },
            
            /**
             * 通过文件夹路径获取应用程序实例
             * @method getAppsByFolder
             * @param {String} folder 文件夹地址
             * @return {Array} apps
             */
            getAppsByFolder : function(folder){
                var apps = [];
                all.each(function(app){
                    if(app.getFolder() === folder){
                        apps.push(app);
                    }
                }, this);
                return apps;
            },
            
            //private
            all : all
            
        };
    }();
    
})();
