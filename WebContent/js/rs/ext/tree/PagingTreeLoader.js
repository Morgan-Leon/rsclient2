Ext.ns('Rs.ext.tree');

(function() {
	/**
	 * @class Rs.ext.tree.PagingTreeLoader
	 * <p>分页树Loader</p>
	 * @extends Ext.tree.TreeLoader
	 * <pre><code>
	the response node json eg: 
	{ 
	    childTotal : 89,
	    nodes : [{
	        id: 1, 
	        name : 'node-1'
	    }, {
	        id : 2, 
	        name : 'node-2'}
	    ]}
	}
	 * </code></pre> 
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.tree.PagingTreeLoader = function(config) {
		Ext.apply(this, config || {});
		// private 如果要递增的添加子项节点条目，则clearOnLoad 必须设为false
		this.clearOnLoad = false;
        Rs.ext.tree.PagingTreeLoader.superclass.constructor.call(this, config);
	};

	Ext.extend(Rs.ext.tree.PagingTreeLoader, Rs.ext.tree.TreeLoader, {

		/**
		 * @cfg {Number} pageSize default 20
		 * <p>每页显示节点条数</p>
		 */
		pageSize : 20,

		/**
		 * @cfg {String} moreNodeName;
		 * <p>更多节点名称</p>
		 */
		moreNodeName : "",
		
		/**
		 * @param {Node} node
		 * @return {Object}
		 */
		getParams : function(node){
			var params = Rs.ext.tree.PagingTreeLoader.superclass.getParams.call(this, node),
			    pi = {
					start : 0,
					limit : this.pageSize
				},
				moreNode = node.lastChild;
			if(moreNode != undefined && moreNode.isMoreNode === true ){
				pi = moreNode.getPagingInfo();
			}
			return Ext.apply(params, pi);
	    },
		
		/**
		 * <p>
		 * Override the method of Ext.tree.TreeLoader update the
		 * childTotal of parent node
		 * </p>
		 * @param {Object} response
		 * @param {Node} node
		 * @param {Function} callback
		 * @param {Object} scope
		 */
		processResponse : function(response, node, callback, scope) {
			var json = response.responseText;
			try {
				var data = response.responseData || Ext.decode(json), 
					nc = data.nodes || [];
				node.beginUpdate();
				// 获取moreNode
				var moreNode = this.getMoreNode(node, data);
				for ( var i = 0, len = nc.length; i < len; i++) {
					var n = this.createNode(nc[i]);
					if (n) {
						node.appendChild(n);
					}
				}
				// 如果有moreNode 则装载该moreNode, 并设置分页信息
				if(moreNode != undefined){
					moreNode.setChildrenInfo({
						childTotal : data.childTotal || node.childNodes.length,
						childCount : node.childNodes.length
					});
					node.appendChild(moreNode);
				}
				node.endUpdate();
				this.runCallback(callback, scope || node, [ node ]);
			} catch (e) {
				this.handleFailure(response);
			}
		},

		// private
		// 如果需要，返回moreNode
		getMoreNode : function(node, data) {
			var nc = data.nodes || [],
		    	ct = data.childTotal || nc.length,
		    	moreNode = node.lastChild;
			/*
			 * 如果最后一个节点是moreNode,则将最有一个节点卸载 
			 */
			if(moreNode != undefined){
				if(moreNode.isMoreNode === true ){
					node.removeChild(moreNode, false);
				}else {
					moreNode = undefined;
				}
			}
			/*
			 * 如果子项总数大于 当前子项个数 与本次加载的子项个数之和，
			 * 表明后台仍有子项未加载,返回一个moreNode
			 */
			if (ct > node.childNodes.length + nc.length){
				if(moreNode == undefined){
					moreNode = this.createVirtualMoreNode(node);
				}
				return moreNode;
			}
		},

		//private
		createVirtualMoreNode : function(node) {
			var attr = {}, a;
			for (a in node.attributes) {
				attr[a] = undefined;
			}
			return new Rs.ext.tree.PagingTreeMoreNode(Ext.apply(attr, {
				text : this.moreNodeName,
				leaf : true
			}));
		}
	});
})();