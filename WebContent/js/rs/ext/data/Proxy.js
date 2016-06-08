Ext.ns("Rs.ext.data");

(function(){
	
	/**
	 * @class Rs.ext.data.Proxy
	 * @extends Ext.data.DataProxy 
	 */
	Rs.ext.data.Proxy = function(conn){
		this.serviceUrl = {
			read : conn.readUrl || conn.url,
			create : conn.createUrl || conn.url,
			update : conn.updateUrl || conn.url,
			destroy : conn.destroyUrl || conn.url
		};
		this.serviceMethod = {
			read : conn.readMethod || 'read',
			create : conn.createMethod || 'create',
			update : conn.updateMethod || 'update',
			destroy : conn.destroyMethod || 'destroy'
		};
		delete conn.readUrl;
		delete conn.readMethod;
		delete conn.createUrl;
		delete conn.createMethod;
		delete conn.updateUrl;
		delete conn.updateMethod;
		delete conn.destroyUrl;
		delete conn.destroyMethod;
		this.useAjax = !conn || !conn.events;
		Rs.ext.data.Proxy.superclass.constructor.call(this, conn);
	    // A hash containing active requests, keyed on action [Ext.data.Api.actions.create|read|update|destroy]
	    var actions = Ext.data.Api.actions;
	    this.activeRequest = {};
	    for (var verb in actions) {
	        this.activeRequest[actions[verb]] = undefined;
	    }
	    this.service = new Rs.data.Service({
	        autoAbort : false
	    });
	};
	
	Ext.extend(Rs.ext.data.Proxy, Ext.data.DataProxy, {
		
		api : {
			read : 'read',
			update : 'update',
			create : 'create',
			destroy : 'destroy'
		},
		
	    doRequest : function(action, rs, params, reader, cb, scope, arg) {
	        var  o = {
	        	url : this.serviceUrl[action],
	        	method : this.serviceMethod[action],
	            request: {
	                callback : cb,
	                scope : scope,
	                arg : arg
	            },
	            params : {
            	    params : params || params.jsonData || params.xmlData || {} 
                },
	            reader: reader,
	            callback : this.createCallback(action, rs),
	            scope: this
	        };
            if (this.activeRequest[action]) {
                //this.service.abort(this.activeRequest[action]);
            }
            this.activeRequest[action] = this.service.call(o);
	    },

	    /**
	     * Returns a callback function for a request.  Note a special case is made for the
	     * read action vs all the others.
	     * @param {String} action [create|update|delete|load]
	     * @param {Ext.data.Record[]} rs The Store-recordset being acted upon
	     * @private
	     */
	    createCallback : function(action, rs) {
	        return function(response, success, o) {
	            this.activeRequest[action] = undefined;
	            if (!success) {
	                if (action === Ext.data.Api.actions.read) {
	                    // @deprecated: fire loadexception for backwards compat.
	                    // TODO remove
	                    this.fireEvent('loadexception', this, o, response);
	                }
	                this.fireEvent('exception', this, 'response', action, o, response);
	                o.request.callback.call(o.request.scope, null, o.request.arg, false);
	                return;
	            }
	            if (action === Ext.data.Api.actions.read) {
	                this.onRead(action, o, response);
	            } else {
	                this.onWrite(action, o, response, rs);
	            }
	        };
	    },

	    /**
	     * Callback for read action
	     * @param {String} action Action name as per {@link Ext.data.Api.actions#read}.
	     * @param {Object} o The request transaction object
	     * @param {Object} res The server response
	     * @fires loadexception (deprecated)
	     * @fires exception
	     * @fires load
	     * @protected
	     */
	    onRead : function(action, o, response) {
	        var result;
	        try {
	            result = o.reader.read(response);
	        }catch(e){
	            // @deprecated: fire old loadexception for backwards-compat.
	            // TODO remove
	            this.fireEvent('loadexception', this, o, response, e);

	            this.fireEvent('exception', this, 'response', action, o, response, e);
	            o.request.callback.call(o.request.scope, null, o.request.arg, false);
	            return;
	        }
	        if (result.success === false) {
	            // @deprecated: fire old loadexception for backwards-compat.
	            // TODO remove
	            this.fireEvent('loadexception', this, o, response);

	            // Get DataReader read-back a response-object to pass along to exception event
	            var res = o.reader.readResponse(action, response);
	            this.fireEvent('exception', this, 'remote', action, o, res, null);
	        }
	        else {
	            this.fireEvent('load', this, o, o.request.arg);
	        }
	        // TODO refactor onRead, onWrite to be more generalized now that we're dealing with Ext.data.Response instance
	        // the calls to request.callback(...) in each will have to be made identical.
	        // NOTE reader.readResponse does not currently return Ext.data.Response
	        o.request.callback.call(o.request.scope, result, o.request.arg, result.success);
	    },
	    /**
	     * Callback for write actions
	     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
	     * @param {Object} trans The request transaction object
	     * @param {Object} res The server response
	     * @fires exception
	     * @fires write
	     * @protected
	     */
	    onWrite : function(action, o, response, rs) {
	        var reader = o.reader;
	        var res;
	        try {
	            res = reader.readResponse(action, response);
	        } catch (e) {
	            this.fireEvent('exception', this, 'response', action, o, response, e);
	            o.request.callback.call(o.request.scope, null, o.request.arg, false);
	            return;
	        }
	        if (res.success === true) {
	            this.fireEvent('write', this, action, res.data, res, rs, o.request.arg);
	        } else {
	            this.fireEvent('exception', this, 'remote', action, o, res, rs);
	        }
	        // TODO refactor onRead, onWrite to be more generalized now that we're dealing with Ext.data.Response instance
	        // the calls to request.callback(...) in each will have to be made similar.
	        // NOTE reader.readResponse does not currently return Ext.data.Response
	        o.request.callback.call(o.request.scope, res.data, res, res.success);
	    },

	    // inherit docs
	    destroy: function(){
	        if(!this.useAjax){
	            this.conn.abort();
	        }else if(this.activeRequest){
	            var actions = Ext.data.Api.actions;
	            for (var verb in actions) {
	                if(this.activeRequest[actions[verb]]){
	                    Rs.Service.abort(this.activeRequest[actions[verb]]);
	                }
	            }
	        }
	        Rs.ext.data.Proxy.superclass.destroy.call(this);
	    }
		
	});
	
})();