Rs.ns("Rs.ext.state");

(function(){
    /**
     * @class Rs.ext.state.Provider
     * <p>该类用于对用户偏好信息的管理</p>
     * @extends Ext.util.Observable
     * @param {Object} config
     */
    Rs.ext.state.Provider = function(config) {
        this.state = {};
        Ext.apply(this, config || {});
        this.addEvents(
            /**
             * @event statechange 
             * 当用户偏好信息发生变化时触发给事件
             * @parqam {Provider} provider
             * @param {String} method;
             * @param {String} module;
             * @param {String} scheme;
             * @param {Object} data;
             */
            'statechange',
            /**
             * @event load 
             * 当用户偏好信息加载完成时触发该事件
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
         * <p>默认为false, 是否加载用户偏好信息<br>
         * 当autoLoad为一个Object则取其module属性来加载数据.
         * </p>
         */
        autoLoad : false,

        /**
         * @cfg {String} url 
         * <p>用户偏好信息URL.</p>
         */
        
        /**
         * <p>加载模块方案</p>
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
                Ext.Msg.alert("提示", "操作失败");
            }
        },

        /**
         * <p>获取某模块下某方案的数据</p>
         * @param {String} module 模块名称
         * @param {String} scheme 方案名称
         * @param {Object} defualtValue 默认值
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
         * <p>获取某模块的所有方案</p>
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
         * <p>获取某模块的默认方案<p>
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
         * 设置某方案某模块的值
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
         * <p>给方案重命名</p>
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
         * <p>设置某方案为默认方案</p>
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
         * <p>删除某模块下的某方案</p>
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
         * <p>删除某模块下的所有方案</p>
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