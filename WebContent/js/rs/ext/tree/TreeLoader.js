Ext.ns("Rs.ext.tree");
(function(){
	/**
	 * @class Rs.ext.tree.TreeLoader
	 * <p>该类继承自Ext.tree.TreeLoader并使用Rs.Services.call从后台获取数据。
	 * dataUrl或url 为获取数据的url
	 * method 为返回数据的后台业务方法名称
	 * getParams 返回要传入后台的参数</p>
	 * @extends Ext.tree.TreeLoader
	 * @constructor
	 * Creates a new Treeloader.
	 * @param {Object} config A config object containing config properties.
	 */
	Rs.ext.tree.TreeLoader = function(config){
	    Ext.apply(this, config);
	    Rs.ext.tree.TreeLoader.superclass.constructor.call(this);
	};

	Rs.extend(Rs.ext.tree.TreeLoader, Ext.tree.TreeLoader, {
		
		/**
		 * @cfg {String} method defualt load
		 * <p>从服务器获取数据的业务方法名称, 默认为load</p>
		 */
		method : 'load',
		
		/**
		 * @cfg {String} nodeAttrsParams
		 * <p>
		 * 要传递到后台的node.attributes的属性名称
		 * </p>
		 */
		
		/**
		 * <p>获取参数</p>
		 * @param {Node} node
		 * @return {Object} params
		 */
		getParams : function(node){
			var params = Rs.ext.tree.TreeLoader.superclass.getParams.call(this, node),
				naps = [];
			if(Ext.isString(this.nodeAttrsParams)){
				naps.push(this.nodeAttrsParams);
			}else if(Ext.isArray(this.nodeAttrsParams)){
				Ext.each(this.nodeAttrsParams, function(p){
					if(Ext.isString(p)){
						naps.push(p);
					}
				}, this);
			}
			return Ext.copyTo(params || {}, node.attributes, naps);
		},
		
		//private
		requestData : function(node, callback, scope){
		    if(this.fireEvent("beforeload", this, node, callback) !== false){
		        if(this.directFn){
		            var args = this.getParams(node);
		            args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
		            this.directFn.apply(window, args);
		        }else{
		            this.transId = Rs.Service.call({
		                method:this.method,
		                url: this.dataUrl||this.url,
		                callback: this.handleResponse,
		                scope: this,
		                argument: {callback: callback, node: node, scope: scope},
		                params: this.getParams(node)
		            });
		        }
		    }else{
		        this.runCallback(callback, scope || node, []);
	    	}
		},
		
	    handleResponse : function(response, succ, options){
	        if(succ === false){
	        	this.handleFailure(response);
	        }else {
	    		this.transId = false;
	            var a = response.argument;
	            this.processResponse(response, a.node, a.callback, a.scope);
	            this.fireEvent("load", this, a.node, response);        	
	        }
	    }

	});
})();