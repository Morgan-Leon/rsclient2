/**
 * ����ģ��
 */
Rs.define('Rs.ext.app.Model', {
    
    extend : Ext.util.Observable,
    
    constructor : function(config){
        Ext.apply(this, config);
        Rs.ext.app.Model.superclass.constructor.apply(this, arguments);
        if(!this.data){
            this.data = {};
        }
    },
    
    /**
     * ����һ������
     */
    set : function(dataIndex, value){
        var ov = this.data[dataIndex];
        if(ov !== value){
            this.data[dataIndex] = value;
            this.fireEvent('change', this, dataIndex, value);
        }
    },
    
    /**
     * ��ȡһ������
     */
    get : function(dataIndex){
        return this.data[dataIndex];
    },
    
    /**
     * ��ȡ����
     */
    getData : function(){
        return this.data;
    },
    
    /**
     * ����ÿ������
     */
    each : function(callback, scope){
        var data = this.data;
        if(Ext.isFunction(callback)){
            for(var k in data){
                var v = data[k];
                callback.call(scope || this, k, v);
            }
        }
    },
    
    /**
     * ��ȡ����
     */
    load : function(options, callback, scope){
        if(Ext.isFunction(options)){
            scope = callback;
            callback = options;
            options = {};
        }    
        var service = new Rs.data.Service(Ext.apply({
            url : this.url,
            method : this.loadMethod || 'load',
            accept : this.accept || 'json'
        }), options);
        service.call({
            params : {
                data : Ext.apply({}, this.data)
            }
        }, function(result){
            if(typeof result == 'object'){
                Ext.apply(this.data, result);
            }
            if(Ext.isFunction(callback)){
                callback.call(scope || this, this, result);
            }
        }, this);
    },
    
    /**
     * ��������
     */
    save : function(options, callback, scope){
        if(Ext.isFunction(options)){
            scope = callback;
            callback = options;
            options = {};
        }
        var service = new Rs.data.Service(Ext.apply({
            url : this.url,
            method : this.saveMethod || 'save',
            accept : this.accept || 'json'
        }, options));
        service.call({
            params : {
                data : Ext.apply({}, this.data)
            }
        }, function(result){
            if(Ext.isFunction(callback)){
                callback.call(scope || this, result);
            }
        }, this);
    }, 
    
    /**
     * ������ݣ�ɾ�����ݿ��е�����
     */
    clear : function(options, callback, scope){
        if(Ext.isFunction(options)){
            scope = callback;
            callback = options;
            options = {};
        }
        var service = new Rs.data.Service(Ext.apply({
            url : this.url,
            method : this.clearMethod || 'clear',
            accept : this.accept || 'json'
        }, options));
        service.call({
            params : {
                data : Ext.apply({}, this.data)
            }
        }, function(result){
            if(Ext.isFunction(callback)){
                callback.call(scope || this, result);
            }
        }, this);
    },
    
    /**
     * ִ�к�̨����
     */
    callService : function(options, callback, scope){
        if(Ext.isFunction(options)){
            scope = callback;
            callback = options;
            options = {
                params : {}
            };
        }
        var params = options.params || {};
        delete options.params;
        var service = new Rs.data.Service(Ext.apply({
            url : this.url,
            method : 'service',
            accept : 'json'
        }, options));
        service.call({
            params : params
        }, function(result){
            if(Ext.isFunction(callback)){
                callback.call(scope || this, result);
            }
        }, this);
    },
    
    /**
     * ��������ģ�͵ļ���
     */
    destroy : function(){
        var events = this.events;
        for(var eventName in events){
            var ce = this.events[eventName.toLowerCase()];
            if (typeof ce == 'object') {
                Ext.each(ce.listeners, function(l){
                    if(l){
                        ce.removeListener(l.fn, l.scope);    
                    }
                }, this);
            }
        }
    }
    
});