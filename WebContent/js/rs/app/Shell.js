Rs.ns("Rs.app");

(function(){
    
    /**
     * @class Rs.app.Shell 
     * @extends Rs.util.Observable 
     * <p>
     * Ӧ�ó����������,��ҳ���и���Ӧ�ó���λ�ý��в��֡�
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
             * ����ʼ������Ӧ�ó������ǰ�������¼�
             * @param {Rs.app.Shell} this
             */
            'beforebuild',
            
            /**
             * @event build
             * ��������Ӧ�ó���������ʱ�������¼�
             * @param {Rs.app.Shell} this 
             */
            'build', 
            
            /**
             * @event afterbuild
             * ��������Ӧ�ó��������ɺ󴥷����¼�
             * @param {Rs.app.Shell} this
             */
            'afterbuild',
            
            /**
             * @event resize
             * ����Ӧ�ó�����Ǵ�С�����ı�ʱ�������¼�
             * @param {Rs.app.Shell} this
             */
            'resize');
        
    };
    
    Rs.extend(Rs.app.Shell, Rs.util.Observable, {
        
        //private
        builded : false,
        
        /**
         * @cfg {String} frameTpl
         * Shell�����ܹ�
         */
        frameTpl : '<div>Hello World.</div>',
        
        /**
         * @cfg {String} regionCls
         * Ӧ�ó���������ʽ
         */
        regionCls : 'rs-app-region',
        
        /**
         * @cfg {String} targetCls
         * Ŀ��λ����ʽ
         */
        
        /**
         * ����Ӧ�ó�������
         * @method setEngine
         * @param {Rs.app.Engine} engine
         */
        setEngine : function(engine){
            this.engine = engine;
        },
        
        /**
         * ��ȡӦ�ó�������
         * @method getEngine
         * @return {Rs.app.Engine} engine
         */
        getEngine : function(){
           return this.engine; 
        },
        
        /**
         * ����Shell
         * @method build
         * @param {Rs.Element} ct ����shell��λ��
         * @param {Function} callback �ص�����
         * @param {Object} scope �ص�����������
         */
        build : function(ct, callback, scope){
            if(!this.builded && this.fireEvent('beforebuild', this) !== false){
                //������ʽ
                if(!(Rs.isEmpty(this.targetCls))){
                    ct.addClass(this.targetCls);
                }
                var engine = this.engine;
                this.onBuild(ct, engine);
                this.fireEvent('build', this);
                this.afterBuild();
                this.builded = true;
                this.fireEvent('afterbuild', this);
                //�������ڴ�С�仯��ͬ������shell��С
                Rs.EventManager.onWindowResize(this.onWindowResize, this);
            }
            if(Rs.isFunction(callback)){
                callback.call(scope || this, engine, this);
            }
        },
        
        /**
         * �����ڴ�С�������ʱ��ִ�и÷���
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
         * ����Shell
         * @method onBuild
         * @param {Rs.Element} ct ����shell��λ��
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
            
            //��ʼ������Ӧ�ó���λ������
            this.initAllRegionCollection();
            
            //����Shell
            this.doBuild();
        }, 
        
        //private
        initAllRegionCollection : function(){
            //��¼���й̶�λ�õ�region
            this.regions = new Rs.util.MixedCollection(false);
            
            //�޹̶�λ�õĴ�������region
            this.windowRegions = new Rs.util.MixedCollection(false);
        }, 
        
        /**
         * ����shell,���ø�Ӧ�ó���λ�õĴ�С��
         * @method doBuild
         */
        doBuild : Rs.emptyFn,
        
        /**
         * ����shell,
         * @method afterBuild
         */
        afterBuild : Rs.emptyFn,
        
        /**
         * �ع�shell,��Ӧ�ó���װ�ɹ���ִ�и÷���
         * @method reBuild
         * @param {Rs.app.Region} reigon
         * @param {Rs.app.Application} app
         */
        reBuild : function(region, app){
            this.doReBuild(region, app);
            this.afterReBuild(region, app);
        },
        
        /**
         * �ع�Ӧ�ó���λ��
         * @method doReBuild
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app
         */
        doReBuild : Rs.emptyFn,
        
        /**
         * ����shell���֮������shell�Ĵ�С.
         * @method afterBuild
         * @param {Rs.app.Region} region
         * @param {Rs.app.Application} app
         */
        afterReBuild : function(region, app){
            //�����window���͵�Ӧ�ó����Ҹó������ʾ��򿪸ô���Ӧ�ó���
            if(region instanceof Rs.app.WindowRegion){
                if(region && app && app.autoRun === true && app.isOpen() != true){
                    app.open(!region.isVisible());
                }
            }
        },
        
        
        /**
         * ����shell���,����doBuild����,���ø���Ӧ�ó����λ�úʹ�С
         * @method setSize
         * @param {Object/Number} w Shell�Ĵ�С����shell�Ŀ��
         * @param {Number} h (optional) Shell�ĸ߶�
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
         * ��ȡshell����λ��
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
         * ��ȡshell�Ŀ��
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
         * ��ȡ�����������
         * @method getFrameConfig
         */
        getFrameConfig : function(){
            return {};
        }, 
        
        /**
         * ��ȡӦ�ó������λ��
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