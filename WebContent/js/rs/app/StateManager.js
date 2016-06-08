(function() {

    /**
     * @class Rs.app.StateManager
     * 页面偏好信息管理类,提供加载和同步用户设置的方法.
     * @constructor
     */
    Rs.app.StateManager = (function() {

        var URL = '/rsc/rsclient/pagestatemanager', 
            onLoad = function(scheme, options, callback, scope) {
                var state = scheme && scheme.stateData ? scheme.stateData : '';
                if (Rs.isFunction(callback)) {
                    callback.call(scope || this, Rs.trim(state)==""?{}:Rs.decode(state));
                }
            }, onSync = function(succ) {
                if(succ != true){
                    alert("提示", "操作失败");
                }
            };

        return {

            /**
             * 加载用户偏好信息,当用户打开页面时读取用户偏好信息数据
             * 
             * @method load
             * @param {String} id 用户偏好id
             * @param {Function} callback 回调方法
             * @param {Object} scope 回调方法作用域
             */
            load : function(id, callback, scope) {
                Rs.Service.call( {
                    url : URL,
                    method : "load",
                    params : {
                        id : id
                    }
                }, onLoad.createDelegate(this, [ callback, scope ], 3), scope);
            },

            /**
             * 同步用户偏好数据到后台服务器
             * 
             * @method sync
             * @param {String} id
             * @param {Object} state
             */
            sync : function(id, state) {
                var stateData = Rs.encode(state);
                Rs.Service.call({
                    url : URL,
                    method : 'sync',
                    params : {
                        id : id,
                        data : stateData
                    }
                }, onSync, this);
            }
            
        };
    })();

})();