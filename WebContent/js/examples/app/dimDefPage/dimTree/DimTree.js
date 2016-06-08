Rs.define('TreeSearching', { 
        /**
         * @class TreeSearching
         * @extends Ext.util.Observable 
         * <p>�����Ҳ��</p>
         * @constructor
         * @param {Object} config
         */
        
        extend : Ext.util.Observable,
                /**
                 * @cfg {String} url ������ѯ������jsp���ú�׺.rsc��ʶ��Ϊ����֮��̨������
                 */
                url : "/rsc/js/examples/app/dimDefPage/dataservice.rsc",
        
        init : function(tree){
            this.tree = tree;
            this.tree.on("searchbydesc", this.findPathsByDesc, this);
            this.tree.on("searchbyatt", this.findPathsByAtt, this);
        },
                
                /**
                 *  ����ά��Ա��������·����
                 * @param {DimTree} tree ά������
                 * @param {String} dimType ά�����͡�
                 * @param {String} dimId ������ʼά�ȳ�Աid��
                 * @param {String} desc ���ҹؼ��֡�  
                 */
                findPathsByDesc : function(tree, dimType, dimId, desc){
                    if(!desc){
                        var tree = this.tree, 
                        root = tree.getRootNode(),
                        node = root.firstChild;
                        while (node) {
                            root.removeChild(node, true);
                            node = root.firstChild;
                        }
                        root.loaded = false;
                        root.expand(false);
                        return;
                    }
                    Rs.Service.call({
                        url : this.url,
                        method : "read",
                        params : {
                            dimType: dimType,
                            dimId : dimId,
                            dimDesc : desc
                        }
                    }, this.reformTree, this);
                },

                
                /**
                 *  ����ά��Ա���Բ���·����
                 * @param {String} desc ά��Ա������  
                 * @param {Array} attrs ά��Ա���ԡ�  
                 */
                findPathsByAtt : function(desc, attrs){
                    if(!desc && attrs.length==0){
                        var tree = this.tree, 
                        root = tree.getRootNode(),
                        node = root.firstChild;
                        while (node) {
                            root.removeChild(node, true);
                            node = root.firstChild;
                        }
                        root.loaded = false;
                        root.expand(false);
                        return;
                    }
                    Rs.Service.call({
                        url : this.url,
                        method : "searchByAttributes",
                        params : {
                            desc : desc,
                            dimAttributes : attrs
                        }
                    }, this.reformTree, this);
                },
                
                //private
                reformTree:function(records){
                    var root = this.tree.getRootNode();
                    var rlength = records.length;
                    var stack = [];
                    for(var i = 0; i < rlength; i++){
                        stack[i] = records[i].path.split("/");
                    }
                    var type = '1';
                    var id = '1';
                    var startNode;
                    root.cascade(function(n){
                        var dimType = n.attributes["dimType"];
                        var dimId = n.attributes["dimId"];
                        if(dimType == type && dimId == id){
                            startNode = n;

                            if(startNode.isExpanded()){
                                var node = startNode.firstChild;
                                while (node) {
                                    startNode.removeChild(node, true);
                                    node = startNode.firstChild;
                                }
                                startNode.loaded=false;
                            }
                            return false;
                        }else n.collapse();
                    }, this);
                    this.locate(startNode, stack, 0);
                },

                //private
                locate:function(node, stack, depth, callback, scope){
                    node.cascade(function(n){
                        var d = n.attributes["path"];
                        if(n.attributes["level"]==depth){
                            for(var i =0 ; i < stack.length; i++){
                                var path = stack[i].slice(0, depth+1).join("/");
                                if(d == path){
                                    if(n.attributes["leaf"] == false){
                                        n.on("beforeappend", function(t,p,c){
                                            for(var j = 0; j < stack.length; j++){
                                                var subpath = stack[j].slice(0, depth+2).join("/");
                                                if(c.attributes["path"]==subpath){
                                                    return true;
                                                }
                                            }
                                            return false;
                                        }, this);
                                        n.expand(1, false, this.locate.createDelegate(this, [node, stack, depth + 1, callback, scope]));
                                    }
                                    var flag = true;
                                    break;
                                }
                            }
                        }
                        if(!flag && !n.isExpanded()){
                            return false;
                        }
                    }, this);
    }
});
    
    /**
     * @class DimTree
     * @extends Ext.tree.TreePanel 
     * <p>ά����</p>
     * @constructor
     * @param {Object} config
     */
Rs.define('DimTree', {
       
    extend : Ext.tree.TreePanel,
    mixins : [Rs.app.Main],
    
    //���¼���
    generateDim : function(){
        Rs.Service.call({
            url : '/rsc/js/examples/app/dimDefPage/dataservice.rsc',
            method : 'generateDim',
            params : {dimType : '1'}
        }, this.refreshTree, this);
        this.fireEvent("generatedim", this);
    },
    
    startQuery:function(){
      var dimMemberName = this.keyWordField.getValue();
      this.fireEvent('searchbydesc', this, '1', '1', dimMemberName);
    },
    
    constructor : function(config){
        this.treeloader = new Rs.ext.tree.TreeLoader({
            dataUrl : 'dataservice.jsp',
            method : 'getSubDimMember',
            nodeAttrsParams : ["dimId", "dimType", "path", "level"]
        });
        
        var button = 
            new Ext.Button({
                text:"���¼���",
                iconCls : "rs-action-settings",
                handler: this.generateDim,
                scope : this
            });
        this.tbar = new Ext.Toolbar({
            layout:"column",
            scope : this,
            items:[this.keyWordField = new Ext.form.TextField({columnWidth:.95}),{
                xtype:"splitbutton",
                icon:"../../../rs/resources/images/query.png",
                menuAlign:"tr-br",
                menu:{
                    items:[{
                        text:"�������Բ�ѯ",
                        scope:this,
                        handler:function(){
                            var addWindow = Rs.getAppEngine().getAppById('dim_search');
                            if(addWindow.isOpen()){
                                addWindow.close();
                            }else {
                                addWindow.open();
                            }
                        }
                    }]
                },
                handler:this.startQuery,
                scope:this
            },button
           ]
        });
        DimTree.superclass.constructor.call(this, Rs.apply(config || {}, {
            useArrows : true,
            
            autoScroll : true,
            
            animate : false,
            
            containerScroll : true,
            
            rootVisible : false,
            
            bodyStyle : 'background-color:#FFFFFF;',
            
            root : {
                nodeType : 'async',
                dimId : 'root',
                dimType :'root'
            },
            
            loader : this.treeloader,
            
            plugins : new TreeSearching({}),
            
            onBeforeAppend : function(tree, root, node){
                return node.attributes.dimType == '1';
            },
            
            /**
             *  ˢ������  
             */
            refreshTree : function(){
                var rootNode = this.getRootNode();
                rootNode.collapse();
                for(var i = 0 ; i < rootNode.childNodes.length ; i++){
                    rootNode.removeChild(rootNode.childNodes[i]);
                }
                rootNode.loaded = false;
                rootNode.expand();
            },
            
            /**
             *  �������ݷ����仯��
             * @param {String} action (Optional) ����仯�Ķ�����  
             * @param {Object} r (Optional) �仯�����ݡ�  
             */
            onInfoChange : function(action, r){
                if(action=='add'){
                    var node = new Ext.tree.TreeNode({
                        dimId:r.id,
                        dimType:'1',
                        text:r.dim_desc,
                        level:this.activenode.level+1,
                        path :r.path,
                        leaf : true
                    });
                    if(this.activenode.leaf){
                        this.activenode.leaf = false;
                    }
                    this.activenode.appendChild(node);
                } else if(action == "remove"){
                    var childNodes = this.activenode.childNodes;
                    for(var i = 0; i < childNodes.length; i++){
                        for(var j = 0; j < r.length; j++){
                            if(childNodes[i].attributes.dimId == r[j].get('id')){
                                this.activenode.removeChild(childNodes[i]);
                                i--;
                                break;
                            }
                        }
                    }
                    if(this.activenode.childNodes.length==0){
                        this.activenode.leaf = true;
                        this.activenode.getUI().removeClass("x-tree-node-expanded");
                        this.activenode.getUI().removeClass("x-tree-node-collapsed");
                        this.activenode.getUI().addClass("x-tree-node-leaf");
                    }
                } else{
                    this.refreshTree();
                }
            }
      }));
      this.root.on('beforeappend', this.onBeforeAppend, this);
      this.addEvents([
            /**
             * @event searchbydesc
             * ��ͨ��������Ϣ���ҽڵ�ʱ����.
             * @param {DimTree} tree
             * @param {String} dimType �������ά��
             * @param {String} dimId ������ʼά��id
             * @param {String} desc ���ҹؼ���
             */
            "searchbydesc",
            /**
            * @event generatedim
            * ������sp����������ʱ����.
            * @param {DimTree} tree
            */
            "generatedim",
            /**
             * @event searchbyatt
             * ��ͨ�����Բ��ҽڵ�ʱ����.
             * @param {String} desc ���ڲ��ҵĹؼ���
             * @param {Array} r ���ڲ��ҵ��������ֵ
             */
            "searchbyatt"]);
      Rs.EventBus.register(this, 'tree', ['click']);
      Rs.EventBus.register(this, 'tree', ['generatedim']);
      Rs.EventBus.on('info-change', this.onInfoChange, this);
      Rs.EventBus.on('attribute-search', function(desc, attrs){
          this.fireEvent("searchbyatt",desc, attrs);
      }, this);
      this.on("click", function(node){
          this.activenode = node;
      },this);
   }    
});