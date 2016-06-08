(function(){
    
    /**
     * @class Rs.app.Region
     * @extends Rs.util.Observable
     * 应用程序放置区域
     * @constructor
     * @param {Rs.app.Shell} shell 页面框架类型
     * @param {Object} config
     */
    Rs.app.Region = function(shell, config){
        this.shell = shell;
        Rs.apply(this, config);
        Rs.app.Region.superclass.constructor.call(this);
        
        this.addEvents(
            
            /**
             * @event beforerender
             * 在该应用程序位置渲染之前触发该事件
             * @param {Rs.app.Region} this 
             */
            'beforerender',
            
            /**
             * @event render
             * 当该应用程序位置渲染完成时触发该事件
             * @param {Rs.app.Region} this
             */
            'render', 
            
            /**
             * @event beforeapplyapp
             * 当应用程序被安装到该位置之前触发该事件
             * @param {Rs.app.Region} this
             * @param {Rs.app.Application} app
             */
            'beforeapplyapp',
            
            /**
             * @event applyapp
             * 当应用程序被安装当该位置时触发该事件
             * @param {Rs.app.Region} this
             * @param {Rs.app.Application} app
             */
            'applyapp',
            
            /**
             * @event beforedestroy
             * 当窗口销毁前触发该事件
             * @param {WindowRegion} this
             */
            'beforedestroy',
            
            /**
             * @event destroy
             * 当窗口被销毁时触发该事件
             * @param {WindowRegion} this
             */
            'destroy');
    };
    
    Rs.extend(Rs.app.Region, Rs.util.Observable, {
        
        /**
         * @cfg {Number} minWidth 
         * 最小宽度
         */
        minWidth : 0,
        
        /**
         * @cfg {Number} maxWidth
         * 最大宽度
         */
        maxWidth : 500,
        
        /**
         * @cfg {Number} minHeight
         * 最小高度
         */
        minHeight : 0,
        
        /**
         * @cfg {Number} maxHeight
         * 最大高度
         */
        maxHeight : 500,
        
        //private 
        applyedapp : false, 
        
        //private
        rendered : false,
        
        //private
        isDestroyed : false,
        
        /**
         * 判断该应用程序位置是否有程序安装
         * @return {Boolean}
         */
        isApplyApp : function(){
            return this.applyedapp === true;
        },
        
        /**
         * 设置宽度
         * @param {Number} w 宽度值
         */
        setWidth : function(w){
            var min = this.minWidth,
                max = this.maxWidth;
            if(w < min){
                w = min;
            }else if(w > max){
                w = max;
            }
            return this.width = w;
        },
        
        /**
         * 设置高度
         * @param {Number} h 高度值
         */
        setHeight : function(h){
            var min = this.minHeight,
                max = this.maxHeight;
            if(h < min){
                h = min;
            }else if(h > max){
                h = max;
            }
            return this.height = h;
        },
        
        /**
         * 获取大小
         * @return {Object}
         */
        getSize : function(){
            return {
                width : this.width,
                height : this.height
            };
        },
        
        /**
         * 设置大小
         * @param {Object} box
         */
        setSize : function(box){
            if(box){
                var w = box.width,
                    h = box.height; 
                if(w){
                    this.setWidth(w);
                }
                if(h){
                    this.setHeight(h);
                }
            }
        },
        
        //private
        getState : function(){
            var size = this.getSize();
            return {
                width : size.width,
                height : size.height
            };
        },
        
        //private
        applyState : function(state){
            var size = {};
            for(var k in state){
                if(k == 'width' || k == 'height'){
                    size[k] = state[k];
                }
            }
            this.setSize(size);
        },
        
        /**
         * 打开该应用程序
         * @method open
         */
        open : function(){
            var el = this.targetEl,
                w = el.getWidth(), h = el.getHeight();
            this.fireEvent('resize', el, w, h);
        },
        
        /**
         * 关闭该应用程序
         * @method close
         */
        close : Rs.emptyFn,
        
        /**
         * 渲染应用程序区域
         * @param {Rs.Element} el
         */
        renderTo : function(el){
            if(!this.rendered && this.fireEvent('beforerender', this) !== false){
                this.targetEl = el;
                this.panelEl = el.wrap({
                    tag : 'div',
                    cls : 'rs-app-blank-region'
                }, false);
                this.rendered = true;
                this.fireEvent('render', this);
            }
        },
        
        /**
         * 将要安装到该位置的应用程序配置信息应用到该位置
         * @param {Rs.app.Application} app
         */
        applyApp : function(app){
            if(app != undefined && !this.applyedapp 
                && this.fireEvent('beforeapplyapp', this, app) !== false){
                
                //应用位置配置
                Rs.apply(this, app.getRegionCfg() || {});
                this.app = app;
                this.name = app.getName();
                this.applyedapp = true;
                
                this.fireEvent('applyapp', this, app);
                
                //应用程序安装完成后修改其面板的配置
                this.afterApplyApp(app);
            }
        },
        
        /**
         * 当安装应用程序到该位置之后执行该方法
         * @method initEvents
         * @param {Application} app
         */
        afterApplyApp : Rs.emptyFn,
        
        /**
         * 获取目标节点
         * @method getTargetEl
         * @return {Rs.Element}
         */
        getTargetEl : function(){
            return this.targetEl;
        },
        
        /**
         * 获取该应用程序位置的原始dom节点,
         * 在应用程序的main方法中可直接将应用程序渲染到该dom节点上
         * @method getRawEl
         * @return {HTTPDOMElement} 
         */
        getRawEl : function(){
            var el = this.targetEl;
            return el.dom;
        },
        
        /**
         * 添加大小调整监听器,当应用程序位置的大小发生变化时可修改应用程序窗体的大小
         * @method addResizeListener
         * @param {Function} callback
         * @param {Object} scope
         * @param {Object} options
         */
        addResizeListener : function(callback, scope, options){
            this.on('resize', function(targetEl, width, height){
                var el = this.targetEl,
                	w = el.getWidth(),
                	h = el.getHeight(),
                    x = el.getX(),
                    y = el.getY(); 
                callback.call(scope || this, width || w, height || h, x, y);
            }, this, Rs.apply({
                delay : 40,
                buffer : 40,
                scope : this
            }, options));
        },
        
        /**
         * 添加位置调整监听器,当应用程序位置的大小发生变化时可修改应用程序窗体的大小
         * @method addMoveListener
         * @param {Function} callback
         * @param {Object} scope
         * @param {Object} options
         */
        addMoveListener : function(callback, scope, options){
            this.on('move', function(){
                var el = this.targetEl,
                    w = el.getWidth(), 
                    h = el.getHeight(),
                    x = el.getX(),
                    y = el.getY();
                callback.call(scope || this, w, h, x, y);
            }, this, Rs.apply({
                delay : 40,
                buffer : 40,
                scope : this
            }, options));
        },
        
        /**
         * 当该应用程序位置被销毁之前,执行该方法
         * @method beforeDestroy
         */
        beforeDestroy : Rs.emptyFn,
        
        /**
         * 销毁该应用程序位置
         * @method destroy
         */
        destroy : function(){
            if(!this.isDestroyed){
                if(this.fireEvent('beforedestroy', this) !== false){
                    this.destroying = true;
                    this.beforeDestroy();
                    this.onDestroy();
                    this.purgeListeners();
                    this.fireEvent('destroy', this);
                    this.destroying = false;
                    this.isDestroyed = true;
                }
            }
        },
        
        /**
         * 当该应用程序位置被销毁时,执行该方法
         * @method onDestroy
         */
        onDestroy : Rs.emptyFn
        
    });
    
})();