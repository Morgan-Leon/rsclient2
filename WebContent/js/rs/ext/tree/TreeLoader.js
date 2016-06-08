Ext.ns("Rs.ext.tree");
(function(){
	/**
	 * @class Rs.ext.tree.TreeLoader
	 * <p>����̳���Ext.tree.TreeLoader��ʹ��Rs.Services.call�Ӻ�̨��ȡ���ݡ�
	 * dataUrl��url Ϊ��ȡ���ݵ�url
	 * method Ϊ�������ݵĺ�̨ҵ�񷽷�����
	 * getParams ����Ҫ�����̨�Ĳ���</p>
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
		 * <p>�ӷ�������ȡ���ݵ�ҵ�񷽷�����, Ĭ��Ϊload</p>
		 */
		method : 'load',
		
		/**
		 * @cfg {String} nodeAttrsParams
		 * <p>
		 * Ҫ���ݵ���̨��node.attributes����������
		 * </p>
		 */
		
		/**
		 * <p>��ȡ����</p>
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