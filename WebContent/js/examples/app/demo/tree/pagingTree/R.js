R = (function() {

	return {
		id : 'page_tree',
		name : '���˿�Ŀ��',
		icon16 : 'acct-tree-icon16',
		js : ['PagingTree.js', 'PagingSearchPlugin.js'],
		css : ['css/main.css'],
		objCfg : {
           clazz : 'rs.demo.tree.PagingTree',
           cfg : {
               queryEnable : false
           }
        }
	};

})();