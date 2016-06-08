Rs.ns("Rs.ext.state");

(function(){
	/**
	 * @class Rs.ext.state.StateManger
	 * <p>
	 *    �û�ƫ����Ϣ����
	 * <p>
	 * @constructor
	 */
	Rs.ext.state.StateManager = function(){
	    var provider = new Rs.ext.state.Provider({});
	    return {
	        /**
	         * <p>
	         * ��ʼ��state manger������ģ����Դ
	         * </p>
	         * @param {Array} modules Ҫ��ʼ����ģ������
	         * @param (Function) callback ��ʼ���ص�����
	         * @param (Object) scope
	         */
	        init : function(modules, callback, scope){
	            provider.load(modules, callback, scope);
	        },
	        
	        /**
	         * <p>����Ĭ�ϵ�state provder</p> 
	         * @parame {Object} stateProvider
	         */
	        setProvider : function(stateProvider){
	            provider = stateProvider;
	        },

	        /**
	         * <p>��ȡstate provder</p>
	         * @return {Provider} 
	         */
	        getProvider : function(){
	            return provider;
	        },

	        /**
	         * <p>��ȡָ��ģ���ָ��������Ĭ��ֵ</p>
	         * @param {String} module ģ������
	         * @param {String} scheme ��ģ�鷽������
	         * @param {Object} defaultValue Ĭ��ֵ
	         * @return {Object} 
	         */
	        get : function(module,  scheme, defaultValue){
	            return provider.get(module, scheme, defaultValue);
	        },
	        
	        /**
	         * <p>��ȡĳģ������з���</p>
	         * @param {String} module ģ������
	         * @return {Object}
	         */
	        getAll : function(module){
	            return provider.getAll(module);
	        },
	        
	        /**
	         * <p>��ȡ��������</p>
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
	         * <p>��ȡĳģ���Ĭ�Ϸ���</p>
	         * @param {String} module ģ������
	         * @return {Object} the default scheme of scheme;
	         */
	        getDefaultSchemeCode : function(module){
	            return provider.getDefaultSchemeCode(module);
	        },
	        
	        /**
	         * <p>����ģ�鷽��ֵ</p>
	         * @param {String} module ģ������
	         * @param {String} scheme ��������
	         * @param {Object} value ֵ
	         * @param {Object} config Ĭ������
	         */
	        set : function(module, scheme, value, config){
	            provider.set(module, scheme, value, config);
	        },
	       
	        /**
	         * <p>����������</p>
	         * @param {String} module ģ������
	         * @param {String} oldName ԭ����
	         * @param {Object} newName ������
	         */
	        rename : function(module, oldName, newName){
	            provider.rename(module, oldName, newName);
	        },
	        
	        /**
	         * <p>����Ĭ�Ϸ���</p>
	         * @param {String} module ģ������
	         * @param {String} scheme ��������
	         */
	        setDefault : function(module, scheme){
	            provider.setDefault(module, scheme);
	        },
	        
	        /**
	         * <p>ɾ��ĳ��ģ���ĳ������</p>
	         * @param {String} module ģ������
	         * @param {String} scheme ��������
	         */
	        clear : function(module, scheme){
	            provider.clear(module, scheme);
	        },
	        
	        /**
	         * <p>ɾ��ĳģ���µ����з���</p>
	         * @param {String} module ģ������
	         */
	        clearAll : function (moduel){
	            provider.clearAll(module);
	        }
	    };
	}();
})();