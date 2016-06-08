(function(){
	/**
	 * @class Rs.ext.tree.PagingTreeMoreNodeUI
	 * @extends Ext.tree.TreeNodeUI
	 */
	Rs.ext.tree.PagingTreeMoreNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {
		
		 // private
	    onChilrenInfoChange : function(node, text, oldText){
	        if(this.rendered){
	        	this.childrenInfo.innerHTML = text;
	        }
	    },
		
		// Override
		renderElements : function(n, a, targetNode, bulkRender) {
			this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
			/**
			 * add some indent caching, this helps performance when
			 * rendering a large tree
			 */
			var nel,
				href = this.getHref(a.href), 
				buf = [
					'<li class="x-tree-node">',
					'<div ext:tree-node-id="',
					n.id,
					'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
					a.cls,
					'" unselectable="on">',
					'<span class="x-tree-node-indent">',
					this.indentMarkup,
					"</span>",
					'<img alt="" src="',
					this.emptyIcon,
					'" class="x-tree-ec-icon x-tree-elbow" />',
					'<span class="x-tree-more-node x-tree-more-node-achor" unselectable="on"></span>',
					'<span ext:qtip="������һҳ����" class="x-tree-more-node x-tree-more-node-icon" unselectable="on"></span>',
					'<span ext:qtip="������������" class="x-tree-more-node x-tree-more-node-all-icon" unselectable="on"></span>',
					'<a hidefocus="on" class="x-tree-node-anchor" href="', href, '" tabIndex="1" ',
					a.hrefTarget ? ' target="' + a.hrefTarget + '"' : "",
					'><span unselectable="on">', 
					n.text,
					"</span></a>",
					'<span unselectable="on">',
					n.childrenInfoMsg,
					"</span>",
					"</div>",
					'<ul class="x-tree-node-ct" style="display:none;"></ul>',
					"</li>" ].join('');

			if (bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())) {
				this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
			} else {
				this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
			}
			this.elNode = this.wrap.childNodes[0];
			this.ctNode = this.wrap.childNodes[1];
			var cs = this.elNode.childNodes;
			this.indentNode = cs[0];
			this.ecNode = cs[1];
			this.iconNode = cs[2];
			this.moreNode = Ext.fly(cs[3]);
			this.moreNode.on("click", function() {
				this.node.appendPagingNodes();
			}, this);
			this.moreAllNode = Ext.fly(cs[4]);
			this.moreAllNode.on("click", function() {
				this.node.appendAllPagingNodes();
			}, this);
			this.anchor = cs[5];
			this.textNode = cs[5].firstChild;
			this.childrenInfo = cs[6];
		}
	});
	
	/**
	 * @class Rs.ext.tree.PagingTreeMoreNode
	 * <p>����ڵ㣬������ʾΪ"����"�����������ڵ�չ���丸��ڵ�ĸ����ӽڵ㡣</p>
	 * @extend Ext.tree.TreeNode
	 * @constructor
	 * @param {Object} config
	 */
	Rs.ext.tree.PagingTreeMoreNode = function(config) {
		Ext.apply(this, config || {});
		Rs.ext.tree.PagingTreeMoreNode.superclass.constructor.apply(this, arguments);
	};
	Ext.extend(Rs.ext.tree.PagingTreeMoreNode, Ext.tree.TreeNode, {

		// is virtual
		isMoreNode : true,
		
		/**
		 * @cfg {NodeUI} defultUI
		 * the ui of node
		 */
		defaultUI : Rs.ext.tree.PagingTreeMoreNodeUI,

		//private
		childrenInfoMsg : "",

		/**
		 * @cfg {String} displayChildrenInfo
		 * <p>��ʾ��ҳ��Ϣ</p>
		 */
		displayChildrenInfo : '��ǰ��ʾ{0}��,��{1}��',
		
		/**
		 * <p>
		 * ����������Ϣ����ҳ��Ϣ�����������ݣ�
		 * childTotal : ʵ����������,
		 * childCount : ��ǰ��������
		 * </p>
		 * @param {Object} childrenInfo
		 */
		setChildrenInfo : function(chindrenInfo) {
			this.childrenInfo = chindrenInfo;
			this.childrenInfoMsg = String.format(this.displayChildrenInfo, 
				chindrenInfo.childCount, 
				chindrenInfo.childTotal);
			this.ui.onChilrenInfoChange(this, this.childrenInfoMsg);
		},
		
		setPagingInfo : function(pagingInfo){
			this.pagingInfo = pagingInfo;
		},
		
		getPagingInfo : function(){
			return this.pagingInfo;
		},
		
		// private
		appendPagingNodes : function() {
			var owner = this.getOwnerTree();
			loader = owner && owner.loader ? owner.loader : null;
			this.setPagingInfo({
				start : this.childrenInfo.childCount,
				limit : loader ? loader.pageSize : 20
			});
			this.onAppendPagingNodes();
		},

		// private
		appendAllPagingNodes : function() {
			var ct = this.childrenInfo.childTotal,
				cc = this.childrenInfo.childCount;
			this.setPagingInfo({
				start : cc,
				limit : ct - cc
			});
			this.onAppendPagingNodes();
		}, 
		
		//private
		onAppendPagingNodes : function(){
			var PN = this.parentNode;
			if(PN){
				PN.childrenRendered = true;
				PN.loaded = false;
				PN.expand(false, false);
			}
		}
	});

})();