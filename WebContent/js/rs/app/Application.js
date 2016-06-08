Rs.ns("Rs.app");

(function() {
    
    /**
     * @class Rs.app.Application
     * @extends Rs.util.Observable
     * Ӧ�ó����ࡣ
     * Ӧ�ó��������ļ�ʾ��:
     * <pre><code>
        R = (function() {

            return {
                id : 'app_store',
                name : 'Ӧ���̵�',
                icon16 : 'app-store-icon16',
                js : ['AppStore.js'],
                css : ['css/main.css'],
                objCfg : 'rs.acct.AppStore'
            };
        
        })(); 
     * </code></pre>
     * Ӧ�ó��򴴽���������:
     * <pre><code>
        Rs.define('tab1', {

            config : {
                html : '����'
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
             * ���������Ӧ�ó������Դ�ļ��󴥷����¼�
             * @param {Rs.app.Application} this
             */
            'loadresfile',
            
            /**
             * @event beforeinstall
             * ����װ��Ӧ�ó���֮ǰ�������¼�,������¼������ŷ���false����ֹ��װ
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             * @param {Number} index
             */
            'beforeinstall',
            
            /**
             * @event install
             * ����Ӧ�ó���װ��ɺ󴥷����¼�
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             */
            'install',
            
            /**
             * @event installfailed
             * ����Ӧ�ó���װʧ�ܺ󴥷����¼�
             * @param {Rs.app.Engine} engine
             * @param {Rs.app.Application} this
             * @param {Rs.app.Region} region
             */
            'installfailed',
            
            /**
             * @event beforeshow
             * ��Ӧ�ó�����ʾ֮ǰ�������¼�,������¼��Ļص���������false����ֹ��ʾ��Ӧ�ó���
             * @param {Rs.app.Application} this
             */
            'beforeopen',
            
            /**
             * @event show
             * ��Ӧ�ó�����ʾ��ʱ�򴥷����¼�
             * @param {Rs.app.Application} this
             */
            'open',
            
            /**
             * @event beforeclose
             * ��Ӧ�ó���ر�֮ǰ�������¼�,������¼��Ļص���������false����ֹ�ر�
             * @param {Rs.app.Application} this
             */
            'beforeclose',
            
            /**
             * @event close
             * ��Ӧ�ó���ر�֮��ִ�и÷���
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
         * Ӧ�ó���ΨһID
         */
        
        /**
         * @cfg {String} name
         * Ӧ�ó�������
         */
        
        /**
         * @cfg {String} icon8
         * Ӧ�ó���ͼ�� 8*8, Ĭ��ֵΪ'rs-app-default-icon8'
         */
        
        /**
         * @cfg {String} icon16
         * Ӧ�ó���ͼ�� 16*16, Ĭ��ֵΪ'rs-app-default-icon16'
         */
        
        
        /**
         * @cfg {String} icon32
         * Ӧ�ó���ͼ�� 32*32, Ĭ��ֵΪ'rs-app-default-icon32'
         */
        
        /**
         * @cfg {object} region
         * ����λ��������Ϣ
         */
        
        /**
         * @cfg {String} folder
         * Ӧ�ó��������ļ���·�������Ӧ�ó���Ϊ���ó��򣬿ɼ�����Ϊ BUILDINS/app_folder�� 
         */
        
        /**
         * @cfg {String} objCfg 
         * Ӧ�ó���obj������������
         * <pre><code>
         * objCfg : {
         *     cfg : {}, //�������,Ĭ��ֵΪ{}
         *     clazz : 'AcctTree', //obj����, �������
         *     main : 'main', //Ӧ�ó�����ڷ���,Ĭ��ֵΪmain,�÷����������Ϊ�̶���engine �� region
         *     provider : 'createInstance', //���󴴽�����,�÷�������һ��obj����
         *     release : 'relaase' //����ر�ʱ�ͷŷ���,�Ǳ������ 
         * }
         * 
         * objCfg : 'AcctTree' //ֻ��������,main provider ʹ��Ĭ��ֵ
         * </code></pre>
         */
        
        /**
         * @cfg {Boolean} autoRun
         * �����Ƿ��Զ�����
         */
        autoRun : false,
        
        //private
        running : false,
        
        /**
         * @cfg {Array} js
         * JS�ļ������б�,���folder�ļ��е�λ�á�
         */
        
        /**
         * @cfg {Array} css
         * app����CSS��ʽ���ļ��б�,���folder�ļ��е�λ��
         */
        
        //private  ��Դ�ļ��Ƿ�������
        resFileLoaded : false,
        
        //private
        installed : false,
        
        /**
         * @cfg {String} resFileName
         * Ӧ�ó��������ļ�����
         */
        resFileName : 'R.js',
        
        // private ����Ӧ�ó��������ļ�
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
         * ��ȡӦ�ó���ID
         * @method getId
         * @return {String} id
         */
        getId : function(){
            return this.id;
        },
        
        /**
         * ��ȡ��Ӧ�ó��������ļ���·��
         * @method getFolder
         * @return {String} folder
         */
        getFolder : function(){
            return this.folder;
        },
        
        /**
         * ��������Ӧ�ó���,������folder ����Ϊ BUILDINS/app_folder
         * ͨ���÷����ɻ�ȡʵ�ʵ��ļ���·��
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
         * ��ȡӦ�ó�������
         * @method getName
         */
        getName : function(){
           return this.name; 
        },
        
        /**
         * ��ȡӦ�ó���ͼ��8*8
         * @method getIcon8
         */
        getIcon8 : function(){
            return this.icon8 || 'rs-app-default-icon8';
        },
        
        /**
         * ��ȡӦ�ó���ͼ��16*16
         * @method getIcon16
         */
        getIcon16 : function(){
            return this.icon16 || 'rs-app-default-icon16';
        },
        
        /**
         * ��ȡӦ�ó���ͼ��32*32
         * @method getIcon32
         */
        getIcon32 : function(){
            return this.icon23 || 'rs-app-default-icon23';
        },
        
        /**
         * ��ȡӦ�ó���λ��ID
         * @method getRegionId
         * @return {String} the id of region
         */
        getRegionId : function(){
            return this.regionId;
        },
        
        /**
         * ��ȡӦ�ó���λ��������Ϣ
         * @method getRegionCfg
         * @return {Object} regionCfg 
         */
        getRegionCfg : function(){
            return Rs.apply({}, this.regionCfg);
        },
        
        /**
         * ��ȡ��Ӧ�ó���װ���λ��
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
         * ��װ��Ӧ�ó���֮ǰִ�и÷���,����÷�������false����ֹ��װ
         */
        onBeforeInstall : Rs.emptyFn,
        
        /**
         * Ӧ�ó���װ,�����ǰ���������ļ�����Ӧ�ó��������ʵ��,���ټ�����Դ�ļ�,
         * ���������ͬID�ĸ�Ӧ�ó���ʵ��,��ǰӦ�ó���ʵ������,����ԭ�е�ʵ��.
         * @method onInstall
         * @param {Engine} engine
         * @param {Region} region
         * @param {Number} index
         * @param {Function} callback �ص�����,ִ�иûص�����ʱ�������Ϊsucc, succΪtrue��ʾ��װ�ɹ�
         * @param {Objecat} scope
         */
        onInstall : function(engine, region, index, callback, scope) {
            if(!this.installed && this.fireEvent('beforeinstall', engine, this, region, index)
                    && this.onBeforeInstall(engine, this, region, index) !== false){
                var apps = Rs.app.AppMgr.getAppsByFolder(this.folder) || [], 
                    len = apps.length,
                    installFn = function(app, engine, region, callback, scope){
                        //��ResFile�ļ��������֮�󣬽���Ӧ�ó���ע�ᵽӦ�ó����������
                        Rs.app.AppMgr.add(app);
                        app.doInstall(engine, region, callback, scope);
                    };
                if(len > 0){
                    //������ڸ��ļ����µ�Ӧ�ó����ʵ��,��ȡ��һ��
                    //�����Ӧ�ó��������ļ�(R.js)�л�ȡ��������Ϣ
                    //Ӧ�õ�ǰ����
                    Rs.applyIf(this, apps[0].resFileConfig);
                    //�ж��Ƿ���ں͵�ǰ����ID��ͬ��Ӧ�ó���ʵ��
                    //�����������ֹ��װ,ִ�лص�������ʱ�����
                    //��Ϊ��װ�ɹ���Ǻ��Ѿ���װ����ͬID��Ӧ�ó���ʵ��
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
                    //�����ڸ��ļ����µ�Ӧ�ó���ʵ��,
                    //���ظ��ļ����µ�Ӧ�ó��������ļ�(R.js)
                    this.loadResFile(function(){
                        //���ظ�Ӧ�ó������Դ�ļ�(css & js)
                        this.loadRes(function(){
                            installFn(this, engine, region, callback, scope);
                        }, this);
                    }, this);
                }
            }
        },
        
        //��װӦ�ó���
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
                Rs.error('��װӦ�ó���ʧ��');
                this.fireEvent('installfailed', engine, this, region);
            };
            onDoInstall(succ, this);
        },
        
        /**
         * ��ȡobj�������ò���
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
         * ��ȡӦ�ó������
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
         * Ӧ�ó�������֮ǰִ�и÷���������÷�������false����ִֹ��
         * @method onBeforeRun
         * @return {Boolean}
         */
        onBeforeRun : Rs.emptyFn,
        
        /**
         * ����Ӧ�ó���,�ɹ�����true����֮�򷵻�false
         * @method run
         * @return {Boolean}
         */
        run : function(){
            var engine = this.engine;
            //ȷ����Ӧ�ó����Ѿ�����obj
            if(this.running != true && this.getObj() 
                && this.fireEvent('beforerun', engine, this)
                && this.onBeforeRun(engine, this) !== false){
                try{
                    //���и�Ӧ�ó������ڷ���
                    region = this.region;
                    this.obj[this.getObjCfg().main](engine, region, this);
                    this.running = true;
                    this.fireEvent('run', engine, this);
                    return true;
                }catch(e){
                    Rs.error('����Ӧ�ó������쳣');
                    return false;
                }
            }
            return false;
        },
        
        /**
         * �رճ���֮ǰִ�и÷���,����÷�������false����ֹ�ر�
         * @method onBeforeShut
         * @return {Boolean} bool
         */
        onBeforeShut : Rs.emptyFn,
        
        /**
         * �ر�Ӧ�ó���,�ɹ�����true����֮�򷵻�false
         * @method shut
         * @return {Boolean}
         */
        shut : function(){
            var engine = this.engine;
            if(this.running == true && this.getObj()
                    && this.fireEvent('beforeshut', engine, this)
                    && this.onBeforeShut(engine, this) !== false){
                try{
                    //����Ӧ�ó���رշ���
                    var release = this.getObjCfg().release;
                    if(release && Rs.isString(release) 
                        && Rs.isFunction(this.obj[release])){
                        this.obj[release](engine, region, this);
                    }
                    this.running = false;
                    this.fireEvent('shut', engine, this);
                    return true;
                }catch(e){
                    Rs.error('�ر�Ӧ�ó������쳣');
                    return false;
                }
            }else {
                return false;
            }
        },
        
        /**
         * ��ʾӦ�ó��򴰿ڻ�չ�����֮ǰִ�и÷���,����÷�������false��ȡ����
         * ����ʾӦ�ó���֮ǰ����ȷ�����Ѿ�ִ�� 
         * @method onBeforeOpen
         */
        onBeforeOpen : Rs.emptyFn,
        
        /**
         * ��ʾӦ�ó��򴰿ڻ�չ�����
         * ��region��applyApp������ʵ���÷���
         * @method show
         * @param {Boolean} behind �Ƿ��Ӧ�ó������,���������Ϊtrueʱ�ź�̨����,
         * �����border���͵�shell��ʾ�Ƿ�չ�������ϱ������ϵ����,�����window��tab
         * ���͵�shell,���ʾ�Ƿ�򿪴���.
         */
        open : function(behind){
            var region = this.region;
            if(region && this.fireEvent('beforeopen', this) !== false
                && this.onBeforeOpen(this, region) !== false){
                //�����ǰӦ�ó�����δ������������Ӧ�ó���
                if(this.running !== true){
                    this.run();
                }
                if(behind !== true){
                    //��Ӧ�ó������
                    region.open();
                    this.fireEvent('open', this);
                }else {
                    //����Ӧ�ó������
                    this.fireEvent('behindopen', this);
                }
                this.openFlag = true;
                this.afterOpen();
            }
        },
        
        /**
         * �򿪸�Ӧ�ó���֮��ִ�и÷���
         * @method afterOpen
         */
        afterOpen : Rs.emptyFn,
        
        /**
         * �ر�Ӧ�ó��򴰿ڻ�ϲ����֮ǰִ�и÷���,����÷�������false��ȡ���ر�
         * @method onBeforeClose
         */
        onBeforeClose : Rs.emptyFn,
        
        /**
         * �ر�Ӧ�ó��򴰿ڻ�ϲ����
         * ��region��applyApp������ʵ���÷���
         * @method close
         */
        close : function(){
            var region = this.region;
            if(region && this.fireEvent('beforeclose', this) 
                && this.onBeforeClose() !== false){
                //���Ӧ�ó�����������,��رո�Ӧ�ó���
                if(this.running == true){
                    this.shut();
                }
                //�ر�Ӧ�ó������
                region.close();
                this.openFlag = false;
                this.fireEvent('close', this);
                this.afterClose();
            }
        },
        
        /**
         * �ر�Ӧ�ó���֮��ִ�и÷���
         * @method afterClose
         */
        afterClose : Rs.emptyFn, 
        
        /**
         * �жϸ�Ӧ�ó����Ƿ���������
         * @method isOpen
         * @return {Boolean}
         */
        isOpen : function(){
            return this.openFlag === true;
        }, 
        
        /**
         * ��ȡӦ�ó���״̬��Ϣ,�����䱣�浽��̨������,
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
         * Ӧ�ó���ƫ����Ϣ
         * @method applyState
         */
        applyState : function(state){
            //�޸�Ӧ�ó���������Ϣ
            
            
            //�޸�Ӧ�ó���λ����Ϣ
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
     * Ӧ�ó��������
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
             * ���Ӧ�ó���
             * @method add 
             */
            add : function(app){
                all.add(app);
            },
            
            /**
             * ��ȡӦ�ó���
             * @method get
             * @param {String} id Ӧ�ó���id
             * @return {Rs.app.Application}
             */
            get : function(id){
                return all.get(id);
            },
            
            /**
             * ɾ��Ӧ�ó���
             * @method remove
             */
            remove : function(app){
                all.remove(app);
            },
            
            /**
             * ͨ���ļ���·����ȡӦ�ó���ʵ��
             * @method getAppsByFolder
             * @param {String} folder �ļ��е�ַ
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
