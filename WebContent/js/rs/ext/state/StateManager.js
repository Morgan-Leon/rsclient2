Rs.ns("Rs.ext.state");

(function(){
	/**
	 * @class Rs.ext.state.StateManger
	 * <p>
	 *    用户偏好信息管理
	 * <p>
	 * @constructor
	 */
	Rs.ext.state.StateManager = function(){
	    var provider = new Rs.ext.state.Provider({});
	    return {
	        /**
	         * <p>
	         * 初始化state manger。加载模块资源
	         * </p>
	         * @param {Array} modules 要初始化的模块名称
	         * @param (Function) callback 初始化回调方法
	         * @param (Object) scope
	         */
	        init : function(modules, callback, scope){
	            provider.load(modules, callback, scope);
	        },
	        
	        /**
	         * <p>设置默认的state provder</p> 
	         * @parame {Object} stateProvider
	         */
	        setProvider : function(stateProvider){
	            provider = stateProvider;
	        },

	        /**
	         * <p>获取state provder</p>
	         * @return {Provider} 
	         */
	        getProvider : function(){
	            return provider;
	        },

	        /**
	         * <p>获取指定模块和指定方案的默认值</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 该模块方案名称
	         * @param {Object} defaultValue 默认值
	         * @return {Object} 
	         */
	        get : function(module,  scheme, defaultValue){
	            return provider.get(module, scheme, defaultValue);
	        },
	        
	        /**
	         * <p>获取某模块的所有方案</p>
	         * @param {String} module 模块名称
	         * @return {Object}
	         */
	        getAll : function(module){
	            return provider.getAll(module);
	        },
	        
	        /**
	         * <p>获取方案个数</p>
	         * @param {String} moduleCode
	         * @return {Number} count the count of the schmes;
	         */
	        getSchemeCount : function(moduleCode){
	            var schemes = this.getAll(moduleCode), 
	                sc, 
	                i = 0;
	            for(sc in schemes){
	                i++;
	            }
	            return i;
	        },
	        
	        /**
	         * <p>获取某模块的默认方案</p>
	         * @param {String} module 模块名称
	         * @return {Object} the default scheme of scheme;
	         */
	        getDefaultSchemeCode : function(module){
	            return provider.getDefaultSchemeCode(module);
	        },
	        
	        /**
	         * <p>设置模块方案值</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 方案名称
	         * @param {Object} value 值
	         * @param {Object} config 默认配置
	         */
	        set : function(module, scheme, value, config){
	            provider.set(module, scheme, value, config);
	        },
	       
	        /**
	         * <p>重命名方案</p>
	         * @param {String} module 模块名称
	         * @param {String} oldName 原名称
	         * @param {Object} newName 新名称
	         */
	        rename : function(module, oldName, newName){
	            provider.rename(module, oldName, newName);
	        },
	        
	        /**
	         * <p>设置默认方案</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 方案名称
	         */
	        setDefault : function(module, scheme){
	            provider.setDefault(module, scheme);
	        },
	        
	        /**
	         * <p>删除某个模块的某个方案</p>
	         * @param {String} module 模块名称
	         * @param {String} scheme 方案名称
	         */
	        clear : function(module, scheme){
	            provider.clear(module, scheme);
	        },
	        
	        /**
	         * <p>删除某模块下的所有方案</p>
	         * @param {String} module 模块名称
	         */
	        clearAll : function (moduel){
	            provider.clearAll(module);
	        }
	    };
	}();
})();