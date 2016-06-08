/**
 * 数据模型
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
     * 设置一个属性
     */
    set : function(dataIndex, value){
        var ov = this.data[dataIndex];
        if(ov !== value){
            this.data[dataIndex] = value;
            this.fireEvent('change', this, dataIndex, value);
        }
    },
    
    /**
     * 获取一个属性
     */
    get : function(dataIndex){
        return this.data[dataIndex];
    },
    
    /**
     * 获取数据
     */
    getData : function(){
        return this.data;
    },
    
    /**
     * 遍历每个数据
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
     * 获取数据
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
     * 保存数据
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
     * 清除数据，删除数据库中的数据
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
     * 执行后台服务
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
     * 销毁数据模型的监听
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