Rs.ns("Rs.ext.state");

(function(){
    /**
     * @class Rs.ext.state.Provider
     * <p>�������ڶ��û�ƫ����Ϣ�Ĺ���</p>
     * @extends Ext.util.Observable
     * @param {Object} config
     */
    Rs.ext.state.Provider = function(config) {
        this.state = {};
        Ext.apply(this, config || {});
        this.addEvents(
            /**
             * @event statechange 
             * ���û�ƫ����Ϣ�����仯ʱ�������¼�
             * @parqam {Provider} provider
             * @param {String} method;
             * @param {String} module;
             * @param {String} scheme;
             * @param {Object} data;
             */
            'statechange',
            /**
             * @event load 
             * ���û�ƫ����Ϣ�������ʱ�������¼�
             * @param {Rs.ext.state.Provider} this provider of the StateManager
             * @param {Array} moduels;
             */
            'load');
        Rs.ext.state.Provider.superclass.constructor.call(this);
        if(this.autoLoad === true) {
            this.load();
        } else if(Rs.isArray(this.autoLoad) && this.autoLoad.length > 0) {
            this.load(this.autoLoad);
        }
        this.on('statechange', this.sync, this, {
            scope : this,
            buffer : 100
        });
    };
    Ext.extend(Rs.ext.state.Provider, Rs.util.Observable, {
        /**
         * @cfg {Boolean} autoLoad  
         * <p>Ĭ��Ϊfalse, �Ƿ�����û�ƫ����Ϣ<br>
         * ��autoLoadΪһ��Object��ȡ��module��������������.
         * </p>
         */
        autoLoad : false,

        /**
         * @cfg {String} url 
         * <p>�û�ƫ����ϢURL.</p>
         */
        
        /**
         * <p>����ģ�鷽��</p>
         * @param {String} modules
         * @param {Function} callback
         * @param {Object} scope
         */
        load : function(modules, callback, scope) {
            var url = this.url || Rs.BASE_STATE_MANAGER_PATH;
        	Rs.Service.call({
                url : url,
                method : "load",
                params : {
                    modules : Rs.isArray(modules) ? modules : [ modules ]
                }
            }, this.__onLoad.createDelegate(this, 
                [callback, scope], 3), scope);
        },
        
        // private
        __onLoad : function(schemes, options, callback, scope) {
            var s, mc, sc, sd, df;
            Rs.each(schemes, function(s) {
                mc = s.moduleCode;
                sc = s.schemeCode;
                s.stateData == undefined ? s.stateData = '' : null;
                sd = Rs.decode(s.stateData || '') || {};
                df = (s.defaultFlag === true);
                this.state[mc] ? null : this.state[mc] = {};
                this.state[mc][sc] ? null : this.state[mc][sc] = {};
                Rs.apply(this.state[mc][sc], {
                    defaultFlag : df,
                    stateData : sd
                });
            }, this);
            if(callback && Rs.isFunction(callback)) {
                callback.call(scope || this, schemes);
            }
            this.fireEvent("load", this, schemes);
        },

        //private
        sync : function(provider, method, params) {
        	var url = this.url || Rs.BASE_STATE_MANAGER_PATH;
        	Rs.Service.call({
            	url : url,
            	method : method,
            	params : params
            }, this.onSync, this);
        },

        // private
        onSync : function(succ) {
            if(succ != true){
                Ext.Msg.alert("��ʾ", "����ʧ��");
            }
        },

        /**
         * <p>��ȡĳģ����ĳ����������</p>
         * @param {String} module ģ������
         * @param {String} scheme ��������
         * @param {Object} defualtValue Ĭ��ֵ
         * @return {Object}
         */
        get : function(module, scheme, defaultValue) {
            return Rs.isDefined(this.state[module])
                && Rs.isObject(this.state[module])
                && Rs.isDefined(this.state[module][scheme]) 
                ? this.state[module][scheme]
                : defaultValue;
        },

        /**
         * <p>��ȡĳģ������з���</p>
         * @param {String} module
         * @return {Object}
         */
        getAll : function(module) {
            return Ext.isDefined(this.state[module])
                && Ext.isObject(this.state[module]) 
                ? this.state[module]
                : {};
        },
        
        /**
         * <p>��ȡĳģ���Ĭ�Ϸ���<p>
         * @param {String} moduleCode
         * @return {String}
         */
        getDefaultSchemeCode : function(moduleCode) {
            var module = this.state[moduleCode], sc, s;
            if(module) {
                for(sc in module) {
                    s = module[sc];
                    if(s.defaultFlag === true) {
                        return sc;
                    }
                }
            }
        },

        /**
         * ����ĳ����ĳģ���ֵ
         * @param {String} module
         * @param {String} scheme
         * @param {Object} value
         */
        set : function(module, scheme, value, config) {
            !Rs.isDefined(this.state[module]) 
            ? this.state[module] = {} 
            : null;
            !Rs.isDefined(this.state[module][scheme]) 
            ? this.state[module][scheme] = {
                defaultFlag : false,
                stateData : ''
            }: null;
            this.state[module][scheme] = Rs.apply(
            	this.state[module][scheme],{ 
            		stateData : value
                });
            Rs.apply(this.state[module][scheme], config || {});
            var m = {}, 
            	s = {}, 
            	d = this.state[module][scheme];
            s[scheme] = Rs.apply(Rs.apply({}, d), {
            	stateData : Rs.encode(d.stateData)
            });
            m[module] = s;
            this.fireEvent("statechange", this, 'sync', {
            	data : m
            });
        },

        /**
         * <p>������������</p>
         * @param {String} module
         * @param {String} oldName 
         * @param {Object} newName 
         */
        rename : function(module, oldName, newName) {
            !Rs.isDefined(this.state[module]) 
            ? this.state[module] = {} : null;
            this.state[module][newName] = Ext.apply( {}, 
            	this.state[module][oldName] || {
                    defaultFlag : false,
                    stateData : ''
                });
            delete this.state[module][oldName];
            this.fireEvent('statechange', this, 'rename', {
                moduleCode : module,
                newName : newName,
                oldName : oldName
            });
        },

        /**
         * <p>����ĳ����ΪĬ�Ϸ���</p>
         * @param {String} module
         * @param {String} scheme
         */
        setDefault : function(module, scheme) {
            var m = this.state[module], sc, s;
            if(m) {
            	for(sc in m) {
                    s = m[sc];
                    if(s) {
                        if(sc == scheme) {
                            s.defaultFlag = true;
                            this.fireEvent('statechange', this,
                                'setDefault', {
                                    moduleCode : module,
                                    schemeCode : scheme
                                });
                        } else {
                            s.defaultFlag = false;
                        }
                    }
                }
            }
        },

        /**
         * <p>ɾ��ĳģ���µ�ĳ����</p>
         * @param {String} module
         * @param {String} scheme
         */
        clear : function(module, scheme) {
            Rs.isDefined(this.state[module])
            && Ext.isDefined(this.state[module][scheme]) 
            ? delete this.state[module][scheme] : null;
            this.fireEvent('statechange', this, 'clear', {
                moduleCode : module,
                schemeCode : scheme
            });
        },

        /**
         * <p>ɾ��ĳģ���µ����з���</p>
         * @param {String} module
         */
        clearAll : function(module) {
            Rs.isDefined(this.state[module]) 
            ? delete this.state[module] : null;
            this.fireEvent('statechange', this, 'clear',{ 
            	moduleCode : module
            });
        }
    });
})();