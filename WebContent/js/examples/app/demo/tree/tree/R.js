R = (function() {

    return {
        id : 'tree',
        name : '���˿�Ŀ��',
        icon16 : 'acct-tree-icon16',
        js : ['SearchPlugin.js', 'Tree.js'],
        css : ['css/main.css'],
        objCfg : {
           clazz : 'rs.demo.tree.Tree',
           cfg : {
               queryEnable : false
           }
        }
    };

})();