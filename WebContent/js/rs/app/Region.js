(function(){
    
    /**
     * @class Rs.app.Region
     * @extends Rs.util.Observable
     * Ӧ�ó����������
     * @constructor
     * @param {Rs.app.Shell} shell ҳ��������
     * @param {Object} config
     */
    Rs.app.Region = function(shell, config){
        this.shell = shell;
        Rs.apply(this, config);
        Rs.app.Region.superclass.constructor.call(this);
        
        this.addEvents(
            
            /**
             * @event beforerender
             * �ڸ�Ӧ�ó���λ����Ⱦ֮ǰ�������¼�
             * @param {Rs.app.Region} this 
             */
            'beforerender',
            
            /**
             * @event render
             * ����Ӧ�ó���λ����Ⱦ���ʱ�������¼�
             * @param {Rs.app.Region} this
             */
            'render', 
            
            /**
             * @event beforeapplyapp
             * ��Ӧ�ó��򱻰�װ����λ��֮ǰ�������¼�
             * @param {Rs.app.Region} this
             * @param {Rs.app.Application} app
             */
            'beforeapplyapp',
            
            /**
             * @event applyapp
             * ��Ӧ�ó��򱻰�װ����λ��ʱ�������¼�
             * @param {Rs.app.Region} this
             * @param {Rs.app.Application} app
             */
            'applyapp',
            
            /**
             * @event beforedestroy
             * ����������ǰ�������¼�
             * @param {WindowRegion} this
             */
            'beforedestroy',
            
            /**
             * @event destroy
             * �����ڱ�����ʱ�������¼�
             * @param {WindowRegion} this
             */
            'destroy');
    };
    
    Rs.extend(Rs.app.Region, Rs.util.Observable, {
        
        /**
         * @cfg {Number} minWidth 
         * ��С���
         */
        minWidth : 0,
        
        /**
         * @cfg {Number} maxWidth
         * �����
         */
        maxWidth : 500,
        
        /**
         * @cfg {Number} minHeight
         * ��С�߶�
         */
        minHeight : 0,
        
        /**
         * @cfg {Number} maxHeight
         * ���߶�
         */
        maxHeight : 500,
        
        //private 
        applyedapp : false, 
        
        //private
        rendered : false,
        
        //private
        isDestroyed : false,
        
        /**
         * �жϸ�Ӧ�ó���λ���Ƿ��г���װ
         * @return {Boolean}
         */
        isApplyApp : function(){
            return this.applyedapp === true;
        },
        
        /**
         * ���ÿ��
         * @param {Number} w ���ֵ
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
         * ���ø߶�
         * @param {Number} h �߶�ֵ
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
         * ��ȡ��С
         * @return {Object}
         */
        getSize : function(){
            return {
                width : this.width,
                height : this.height
            };
        },
        
        /**
         * ���ô�С
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
         * �򿪸�Ӧ�ó���
         * @method open
         */
        open : function(){
            var el = this.targetEl,
                w = el.getWidth(), h = el.getHeight();
            this.fireEvent('resize', el, w, h);
        },
        
        /**
         * �رո�Ӧ�ó���
         * @method close
         */
        close : Rs.emptyFn,
        
        /**
         * ��ȾӦ�ó�������
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
         * ��Ҫ��װ����λ�õ�Ӧ�ó���������ϢӦ�õ���λ��
         * @param {Rs.app.Application} app
         */
        applyApp : function(app){
            if(app != undefined && !this.applyedapp 
                && this.fireEvent('beforeapplyapp', this, app) !== false){
                
                //Ӧ��λ������
                Rs.apply(this, app.getRegionCfg() || {});
                this.app = app;
                this.name = app.getName();
                this.applyedapp = true;
                
                this.fireEvent('applyapp', this, app);
                
                //Ӧ�ó���װ��ɺ��޸�����������
                this.afterApplyApp(app);
            }
        },
        
        /**
         * ����װӦ�ó��򵽸�λ��֮��ִ�и÷���
         * @method initEvents
         * @param {Application} app
         */
        afterApplyApp : Rs.emptyFn,
        
        /**
         * ��ȡĿ��ڵ�
         * @method getTargetEl
         * @return {Rs.Element}
         */
        getTargetEl : function(){
            return this.targetEl;
        },
        
        /**
         * ��ȡ��Ӧ�ó���λ�õ�ԭʼdom�ڵ�,
         * ��Ӧ�ó����main�����п�ֱ�ӽ�Ӧ�ó�����Ⱦ����dom�ڵ���
         * @method getRawEl
         * @return {HTTPDOMElement} 
         */
        getRawEl : function(){
            var el = this.targetEl;
            return el.dom;
        },
        
        /**
         * ��Ӵ�С����������,��Ӧ�ó���λ�õĴ�С�����仯ʱ���޸�Ӧ�ó�����Ĵ�С
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
         * ���λ�õ���������,��Ӧ�ó���λ�õĴ�С�����仯ʱ���޸�Ӧ�ó�����Ĵ�С
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
         * ����Ӧ�ó���λ�ñ�����֮ǰ,ִ�и÷���
         * @method beforeDestroy
         */
        beforeDestroy : Rs.emptyFn,
        
        /**
         * ���ٸ�Ӧ�ó���λ��
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
         * ����Ӧ�ó���λ�ñ�����ʱ,ִ�и÷���
         * @method onDestroy
         */
        onDestroy : Rs.emptyFn
        
    });
    
})();