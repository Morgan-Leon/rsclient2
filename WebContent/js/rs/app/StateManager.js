(function() {

    /**
     * @class Rs.app.StateManager
     * ҳ��ƫ����Ϣ������,�ṩ���غ�ͬ���û����õķ���.
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
                    alert("��ʾ", "����ʧ��");
                }
            };

        return {

            /**
             * �����û�ƫ����Ϣ,���û���ҳ��ʱ��ȡ�û�ƫ����Ϣ����
             * 
             * @method load
             * @param {String} id �û�ƫ��id
             * @param {Function} callback �ص�����
             * @param {Object} scope �ص�����������
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
             * ͬ���û�ƫ�����ݵ���̨������
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