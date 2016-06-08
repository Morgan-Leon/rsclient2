Rs.ns("Rs.app");

(function(){
    
    /**
     * @class Rs.app.Shell 
     * @extends Rs.util.Observable 
     * <p>
     * 应用程序引擎外壳,对页面中各个应用程序位置进行布局。
     * </p>
     * @constructor
     * @param {Object} config
     */
    Rs.app.Shell = function(config){
        
        this.id = Rs.id(null, 'rs-shell-');
        
        Rs.apply(this, config);
        
        Rs.app.Shell.superclass.constructor.call(this);
        
        this.addEvents(
            /**
             * @event beforebuild
             * 当开始构建该应用程序外壳前触发该事件
             * @param {Rs.app.Shell} this
             */
            'beforebuild',
            
            /**
             * @event build
             * 当构建该应用程序外壳完成时触发该事件
             * @param {Rs.app.Shell} this 
             */
            'build', 
            
            /**
             * @event afterbuild
             * 当构建该应用程序外壳完成后触发该事件
             * @param {Rs.app.Shell} this
             */
            'afterbuild',
            
            /**
             * @event resize
             * 当该应用程序外壳大小发生改变时触发该事件
             * @param {Rs.app.Shell} this
             */
            'resize');
        
    };
    
    Rs.extend(Rs.app.Shell, Rs.util.Observable, {
        
        //private
        builded : false,
        
        /**
         * @cfg {String} frameTpl
         * Shell基础架构
         */
        frameTpl : '<div>Hello World.</div>',
        
        /**
         * @cfg {String} regionCls
         * 应用程序区域样式
         */
        regionCls : 'rs-app-region',
        
        /**
         * @cfg {String} targetCls
         * 目标位置样式
         */
        
        /**
         * 设置应用程序引擎
         * @method setEngine
         * @param {Rs.app.Engine} engine
         */
        setEngine : function(engine){
            this.engine = engine;
        },
        
        /**
         * 获取应用程序引擎
         * @method getEngine
         * @return {Rs.app.Engine} engine
         */
        getEngine : function(){
           return this.engine; 
        },
        
        /**
         * 构建Shell
         * @method build
         * @param {Rs.Element} ct 构建shell的位置
         * @param {Function} callback 回调方法
         * @param {Object} scope 回调方法作用域
         */
        build : function(ct, callback, scope){
            if(!this.builded && this.fireEvent('beforebuild', this) !== false){
                //设置样式
                if(!(Rs.isEmpty(this.targetCls))){
                    ct.addClass(this.targetCls);
                }
                var engine = this.engine;
                this.onBuild(ct, engine);
                this.fireEvent('build', this);
                this.afterBuild();
                this.builded = true;
                this.fireEvent('afterbuild', this);
                //监听窗口大小变化，同步调整shell大小
                Rs.EventManager.onWindowResize(this.onWindowResize, this);
            }
            if(Rs.isFunction(callback)){
                callback.call(scope || this, engine, this);
            }
        },
        
        /**
         * 当窗口大小发生变的时候执行该方法
         * @method onWindowResize
         */
        onWindowResize : function(){
            var b = this.getSize(),
                w = b.width,
                h = b.height;
            this.setSize(b);
            this.fireEvent('resize', this, w, h);
        },
        
        /**
         * 构建Shell
         * @method onBuild
         * @param {Rs.Element} ct 构建shell的位置
         * @param {Rs.app.Engine} engine
         */
        onBuild : function(ct, engine){
            //frame
            this.frame = ct.createChild({
                id : 'rs-engine-frame',
                tag : 'div'
            });
            this.frame.addClass('rs-engine-frame');
            
            var t = new Rs.Template(this.frameTpl).compile();
            t.insertFirst(this.frame, this.getFrameConfig(), true);
            
            //初始化所有应用程序位置容器
            this.initAllRegionCollection();
            
            //构建Shell
            this.doBuild();
        }, 
        
        //private
        initAllRegionCollection : function(){
            //记录具有固定位置的region
            this.regions = new Rs.util.MixedCollection(false);
            
            //无固定位置的窗口类型region
            this.windowRegions = new Rs.util.MixedCollection(false);
        }, 
        
        /**
         * 构建shell,设置各应用程序位置的大小等
         * @method doBuild
         */
        doBuild : Rs.emptyFn,
        
        /**
         * 构建shell,
         * @method afterBuild
         */
        afterBuild : Rs.emptyFn,
        
        /**
         * 重构shell,当应用程序安装成功后执行该方法
         * @method reBuild
         * @param {Rs.app.Region} reigon
         * @param {Rs.app.Application} app
         */
        reBuild : function(region, app){
            this.doReBuild(region, app);
            this.afterReBuild(region, app);
        },
        
        /**
         * 重构应用程序位置
         * @method doReBuild
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app
         */
        doReBuild : Rs.emptyFn,
        
        /**
         * 构建shell完毕之后，设置shell的大小.
         * @method afterBuild
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app
         */
        afterReBuild : function(region, app){
            //如果是window类型的应用程序且该程序可显示则打开该窗口应用程序
            if(region instanceof Rs.app.WindowRegion){
                if(region && app && app.autoRun === true && app.isOpen() != true){
                    app.open(!region.isVisible());
                }
            }
        },
        
        
        /**
         * 设置shell宽高,调用doBuild方法,设置各个应用程序的位置和大小
         * @method setSize
         * @param {Object/Number} w Shell的大小或者shell的宽度
         * @param {Number} h (optional) Shell的高度
         */
        setSize : function(w, h){
            // support for standard size objects
            if(typeof w == 'object'){
                h = w.height;
                w = w.width;
            }
            // not builded
            if(!this.builded){
                this.width  = w;
                this.height = h;
                return this;
            }
            this.lastSize = {width: w, height: h};
            this.frame.setWidth(w);
            this.frame.setHeight(h);
            this.fireEvent('resize', this, w, h);
            //re build all regions
            this.reBuild();
        },
        
        /**
         * 获取shell所处位置
         * @method getXY
         * @return {Array}
         */
        getXY : function(){
            var engine = this.engine;
            if(engine){
                return engine.getXY();
            }else {
                return [0, 0];
            }
        },
        
        /**
         * 获取shell的宽高
         * @method getSize
         * @return {Object}
         */
        getSize : function(){
            var engine = this.engine;
            if(engine){
                return engine.getSize();
            }else {
                var D = Rs.lib.Dom,
                    w = D.getViewWidth(false),    
                    h = D.getViewHeight(false);
                return {
                    width : w,
                    height : h
                };
            }
        },
        
        
        /**
         * 获取基础框架配置
         * @method getFrameConfig
         */
        getFrameConfig : function(){
            return {};
        }, 
        
        /**
         * 获取应用程序放置位置
         * @method gerRegion
         * @param {String} id 
         */
        getRegion : function(id){
            var region = this.regions.get(id); 
            if(region){
                return region;
            }else {
                region = new Rs.app.WindowRegion(this, {});
                return this.windowRegions.add(region);
            }
        },
        
        /**
         * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
         * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
         * @param {Number|String} v The encoded margins
         * @return {Object} An object with margin sizes for top, right, bottom and left
         */
        parseMargins : function(v){
            if (Rs.isNumber(v)) {
                v = v.toString();
            }
            var ms  = v.split(' '),
                len = ms.length;
                
            if (len == 1) {
                ms[1] = ms[2] = ms[3] = ms[0];
            } else if(len == 2) {
                ms[2] = ms[0];
                ms[3] = ms[1];
            } else if(len == 3) {
                ms[3] = ms[1];
            }        
            return {
                top   :parseInt(ms[0], 10) || 0,
                right :parseInt(ms[1], 10) || 0,
                bottom:parseInt(ms[2], 10) || 0,
                left  :parseInt(ms[3], 10) || 0
            };
        }

        
    });
    
    /**
     * 
     */
    Rs.app.SHELL = {};
    
})();