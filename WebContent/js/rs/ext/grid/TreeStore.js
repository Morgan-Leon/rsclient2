Ext.ns("Rs.ext.grid");

(function(){
    
    var Node = function(config, record) {
        
        this.idProperty = config && config.idProperty ? config.idProperty : 'id';
        delete config.idProperty;
        
        Node.superclass.constructor.call(this, config);
        //record 和 node 相互持有引用
        if(record != undefined){
            this.record = record;
            record.node = this;
        }
        this.addEvents(

            'beforeexpand', 
            
            'expand', 
            
            'beforecollapse', 
            
            'collapse');
    };

    Ext.extend(Node, Ext.tree.AsyncTreeNode, {
        
        //private
        isNode : true,
        
        //private
        loading : -1,
        
        //
        getId : function(){
            return this.id;
        },

        //
        isExpanded : function() {
            return this.expanded === true;
        },

        //
        isLoaded : function() {
            return this.loading > 0;
        },
        
        //
        setLoaded : function(loaded){
            loaded === true ? (this.loading = 1) : (this.loading = -1);
        },
        
        //
        isLoading : function() {
            return this.loading === 0;
        }, 
        
        //
        setLoading : function(){
            this.loading = 0;
        },
        
        
        //
        isLeaf : function() {
            return this.attributes.leaf === true;
        },      
        
        ///
        createNode: function(record) {
            if(record && record.isNode === true){
                return record;
            }else if(record.data != undefined){
                var data = record.data;
                node = new Node(Ext.apply(data, {
                    id : data[this.idProperty],
                    idProperty : this.idProperty
                }), record);
                return node;
            };
        },
        
        //
        appendChild : function(node){
            var me = this,
                i, ln;
            if (Ext.isArray(node)) {
                for (i = 0, ln = node.length; i < ln; i++) {
                    me.appendChild(node[i]);
                }
            } else {
                node = me.createNode(node);
                if(node != undefined){
                    return Node.superclass.appendChild.call(this, node);
                }
            }
        }, 
        
        //private
        expand : function(recursive, callback, scope){
            var me = this;
            if(!me.isLeaf() && !me.isExpanded()){
                me.fireEvent('beforeexpand', me, function(nodes){
                    me.expanded = true;
                    me.fireEvent('expand', me, me.childNodes);
                    if (recursive === true) {
                        me.expandChildren(true, callback, scope);
                    }else {
                        me.runCallback(callback, scope || me, [me.childNodes]);
                    }
                }, scope);
            }else {
                me.runCallback(callback, scope || me, []);
            }
        }, 
        
        //private
        expandChildren: function(recursive, callback, scope) {
            var me = this,
                i = 0,
                nodes = me.childNodes,
                ln = nodes.length,
                node,
                expanding = 0;
            for (; i < ln; ++i) {
                node = nodes[i];
                if (!node.isLeaf() && !node.isExpanded()) {
                    expanding++;
                    nodes[i].expand(recursive, function () {
                        expanding--;
                        if (callback && !expanding) {
                            me.runCallback(callback, scope || me, me.childNodes); 
                        }
                    }, me);
                }
            }
            if (!expanding && callback) {
                me.runCallback(callback, scope || me, me.childNodes);
            }
        }, 
        
        
        removeChild : function(node, destroy){
            //this.ownerTree.getSelectionModel().unselect(node);
            Ext.tree.TreeNode.superclass.removeChild.apply(this, arguments);
            
            if(!destroy){
                var rendered = node.ui.rendered;
                
                if(rendered){
                    node.ui.remove();
                }
                if(rendered && this.childNodes.length < 1){
                    this.collapse(false, false);
                }else{
                    this.ui.updateExpandIcon();
                }
                if(!this.firstChild && !this.isHiddenRoot()){
                    this.childrenRendered = false;
                }
            }
            return node;
        },
        
        destroy : function(silent){
            Ext.tree.TreeNode.superclass.destroy.call(this, silent);
            Ext.destroy(this.ui, this.loader);
            this.ui = this.loader = null;
        },
        
        //private
        collapse: function(recursive, callback, scope) {
            var me = this;
            if (!me.isLeaf() && me.isExpanded()) {
                me.fireEvent('beforecollapse', me, function(nodes) {
                    me.expanded = false;
                    if (recursive) {
                        me.collapseChildren(true, callback, scope);
                        me.fireEvent('collapse', me, me.childNodes, false);
                    }else {
                        me.fireEvent('collapse', me, me.childNodes, false);
                        me.runCallback(callback, scope || me, [me.childNodes]);
                    }
                }, me);
            }else {
                me.runCallback(callback, scope || me);
            }
        },
        
        //private
        collapseChildren: function(recursive, callback, scope) {
            var me = this,
                i = 0,
                nodes = me.childNodes,
                ln = nodes.length,
                node,
                collapsing = 0;
            
            for (; i < ln; ++i) {
                node = nodes[i];
                if (!node.isLeaf() && node.isExpanded()) {
                    collapsing++;
                    nodes[i].collapse(recursive, function () {
                        collapsing--;
                        if (callback && !collapsing) {
                            me.runCallback(callback, scope || me, me.childNodes); 
                        }
                    });                            
                }
            }
            if (!collapsing && callback) {
                me.runCallback(callback, scope || me, me.childNodes);
            }
        },
        
        //private
        runCallback : function(cb, scope, args){
            if(Ext.isFunction(cb)){
                cb.apply(scope, args);
            }
        }
        
    });
    
    //private
    var Tree = function(config){
        Tree.superclass.constructor.call(this, config);
    };
    
    Ext.extend(Tree, Ext.data.Tree, {
        
        //proxyNodeEvent
        proxyNodeEvent : function(ename, node, a1, a2, a3, a4, a5){
            if(ename == 'collapse' || ename == 'expand' || ename == 'beforecollapse' || ename == 'beforeexpand' || ename == 'move' || ename == 'beforemove'){
                ename = ename+'record';
            }
            if(ename == 'expandrecord' || ename == 'collapserecord'){
                var pr = node.record, cr = []; 
                if(Ext.isArray(a1)){
                    for(var i = 0, l = a1.length; i < l; i++){
                        if(a1[i] != undefined && a1[i].isNode && a1[i].record != undefined){
                            cr.push(a1[i].record);
                        }
                    }
                }else if(a1 != undefined && a1.isNode && a1.record != undefined){
                    cr.push(a1.record);
                }
                return this.fireEvent(ename, pr, cr, a2, a3, a4, a5);
            }else {
                var pr = node.record;
                if(node.isRoot || pr != undefined){
                    return this.fireEvent(ename, pr, a1, a2, a3, a4, a5);
                }
            }
        }
    
    });
    
    
    /**
     * @class Rs.ext.grid.TreeStore
     * TreeStore 类
     * @extends Rs.ext.data.Store
     * @constructor {Object} config
     */
    Rs.ext.grid.TreeStore = function(config){
        var me = this, 
            fields;
        config = Ext.apply({}, config);
        fields = config.fields || me.fields;
        if (!fields) {
            config.fields = [{name: 'text', type: 'string'}];
        }
        
        //设置Store不自动加载数据
        config.autoLoad = false;
        
        Rs.ext.grid.TreeStore.superclass.constructor.call(this, Ext.applyIf(config, {
        	root : 'children'
        }));
        
        me.tree = new Ext.data.Tree();
        // 重写Ext.data.Tree的proxyNodeEvent方法,修改传入参数
        me.tree = new Tree();
        
        me.tree.on({
            scope: me,
            remove: me.onRemoveRecord,
            
            beforeexpandrecord : me.onBeforeExpandRecord,
            expandrecord : me.onExpandRecord,
            beforecollapserecord : me.onBeforeCollapseRecord,
            collapserecord : me.onCollapseRecord,
            beforeinsertrecord : me.onBeforeExpandRecord,
            insertrecord: me.onExpandRecord,
            
            beforemoverecord : me.onBeforeMoveRecord,
            moverecord : me.onMoveRecord
        });
        
        me.relayEvents(me.tree, [
             /**
                 * @event append Fires when a new child node is appended to a
                 *        node in this store's tree.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The newly appended node
                 * @param {Number}
                 *            index The index of the newly appended node
                 */
             "append",
             
             /**
                 * @event remove Fires when a child node is removed from a node
                 *        in this store's tree.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node removed
                 */
             "remove",
             
             /**
                 * @event move Fires when a node is moved to a new location in
                 *        the store's tree
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            node The node moved
                 * @param {Node}
                 *            oldParent The old parent of this node
                 * @param {Node}
                 *            newParent The new parent of this node
                 * @param {Number}
                 *            index The index it was moved to
                 */
             "move",
             
             /**
                 * @event insert Fires when a new child node is inserted in a
                 *        node in this store's tree.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node inserted
                 * @param {Node}
                 *            refNode The child node the node was inserted
                 *            before
                 */
             "insert",
             
             /**
                 * @event beforeappend Fires before a new child is appended to a
                 *        node in this store's tree, return false to cancel the
                 *        append.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node to be appended
                 */
             "beforeappend",
             
             /**
                 * @event beforeremove Fires before a child is removed from a
                 *        node in this store's tree, return false to cancel the
                 *        remove.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node to be removed
                 */
             "beforeremove",
             
             /**
                 * @event beforemove Fires before a node is moved to a new
                 *        location in the store's tree. Return false to cancel
                 *        the move.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            node The node being moved
                 * @param {Node}
                 *            oldParent The parent of the node
                 * @param {Node}
                 *            newParent The new parent the node is moving to
                 * @param {Number}
                 *            index The index it is being moved to
                 */
             "beforemove",
             
             /**
                 * @event beforeinsert Fires before a new child is inserted in a
                 *        node in this store's tree, return false to cancel the
                 *        insert.
                 * @param {Tree}
                 *            tree The owner tree
                 * @param {Node}
                 *            parent The parent node
                 * @param {Node}
                 *            node The child node to be inserted
                 * @param {Node}
                 *            refNode The child node the node is being inserted
                 *            before
                 */
             "beforeinsert",
              
              /**
                 * @event expand Fires when this node is expanded.
                 * @param {Node}
                 *            this The expanding node
                 */
              "expand",
              
              /**
                 * @event collapse Fires when this node is collapsed.
                 * @param {Node}
                 *            this The collapsing node
                 */
              "collapse",
              
              /**
                 * @event beforeexpand Fires before this node is expanded.
                 * @param {Node}
                 *            this The expanding node
                 */
              "beforeexpand",
              
              /**
                 * @event beforecollapse Fires before this node is collapsed.
                 * @param {Node}
                 *            this The collapsing node
                 */
              "beforecollapse",

              /**
                 * @event sort Fires when this TreeStore is sorted.
                 * @param {Node}
                 *            node The node that is sorted.
                 */             
              "sort",
              
              "rootchange"
         ]);
         
         me.addEvents(
             /**
                 * @event rootchange Fires when the root node on this TreeStore
                 *        is changed.
                 * @param {Rs.ext.grid.TreeStore}
                 *            store This TreeStore
                 * @param {Node}
                 *            The new root node.
                 */
             'rootchange'
        );
        
        //设置跟节点
        this.rootNode = this.setRootNode(this.rootNode);
		
		//主动展开跟节点 
		this.getRootNode().expand();
    };
    
    Ext.extend(Rs.ext.grid.TreeStore, Rs.ext.data.Store, {
        
        /**
         * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove
         *      previously existing child nodes before loading.
         */
        clearOnLoad : true,

        /**
         * @cfg {String} nodeParameter
         */
        
        /**
         * @cfg {String} nodeParameter The name of the parameter sent to the server
         *      which contains the identifier of the node. Defaults to
         *      <tt>'node'</tt>.
         */
        nodeParameter: 'node',
        
        /**
         * @cfg {String/Array} 将节点的属性值作为参数传递到服务器 
         */
        nodeAttributesAsParameter : [], 
        
        /**
         * @cfg {String} defaultRootId The default root id. Defaults to 'root'
         */
        defaultRootId: 'root',

        /**
         * @cfg {Boolean} folderSort Set to true to automatically prepend a leaf
         *      sorter (defaults to <tt>undefined</tt>)
         */
        folderSort: false,
        
        /**
         * 设置根节点
         * @param {Node} root
         */
        setRootNode: function(root) {
            var me = this;
            
            root = root || {};
            if (!root.isNode) {
                root = new Node(Ext.applyIf(root, {
                    id: me.defaultRootId,
                    idProperty : this.idProperty
                }));
            }
            me.tree.setRootNode(root);
            if (!root.isLoaded() && root.isExpanded()) { 
                me.load({
                    node : root 
                });
            }
            this.fireEvent('rootchange', me, root);
            return root;
        },
        
        /**
         * 获取根节点
         * @return {Node}
         */
        getRootNode: function() {
            var root = this.tree.getRootNode(); 
            if(root == undefined){
                root = this.setRootNode({
                    expanded: true
                });
            }
            return root;
        },

        /**
         * Returns the record node by id
         * @return {Ext.data.NodeInterface}
         */
        getNodeById: function(id) { 
            return this.tree.getNodeById(id); 
        },
        
        /**
         * Loads the Store using its configured {@link #proxy}.
         * 
         * @param {Object}
         *            options Optional config object. This is passed into the
         *            {@link Ext.data.Operation Operation} object that is
         *            created and then sent to the proxy's
         *            {@link Ext.data.proxy.Proxy#read} function. The options
         *            can also contain a node, which indicates which node is to
         *            be loaded. If not specified, it will default to the root
         *            node.
         */
        load: function(options) {
            options = options || {};
            options.params = options.params || {};
            
            var me = this,
                node = options.node || me.getRootNode();
                
            if (!node) {
                node = me.setRootNode({
                    expanded: true
                });
            }
            
            if (me.clearOnLoad) {
                node.removeAll();
            }
            
            Ext.applyIf(options, {
                node: node
            });
            options.params[me.nodeParameter] = node ? node.getId() : 'root';
            
            var pars = [].concat(me.nodeAttributesAsParameter);
            if(pars.length > 0){
            	Ext.copyTo(options.params, node.attributes, pars);	
            }
            Ext.applyIf(options.params, node.getOwnerTree().getRootNode().getLoader().baseParams);
            if (node) {
                node.setLoading();
            }
            return Rs.ext.grid.TreeStore.superclass.load.call(this, options);
        },
        
        /**
         * Fills a record with a series of child records.
         * 
         * @private
         */
        fillNode: function(node, records) {
            var ln = records ? records.length : 0,
                i = 0, result = [];
            node.setLoaded(true);
            for (; i < ln; i++) {
            	var temp = records[i];
            	if(node.fireEvent("beforeappendrecord", node, temp) !== false){
            		node.appendChild(temp);
            		result.push(temp);
                }
            }
            return result;
        },
        
        //private
        loadRecords : function(o, options, success){
            if (this.isDestroyed === true) {
                return;
            }
            this.totalLength = o.totalRecords || 0;
            if(!o || success === false){
                if(success !== false){
                    this.fireEvent('load', this, [], options);
                }
                if(options.callback){
                    options.callback.call(options.scope || this, [], options, false, o);
                }
                return;
            }
            o.records = this.fillNode(options.node, o.records);
            //将加载的数据添加到Store
            if(options.node == this.getRootNode()){
            	var r = o.records, t = o.totalRecords || r.length;
                var toAdd = [], rec, cnt = 0;
    	        for(i = 0, len = r.length; i < len; ++i){
    	            rec = r[i];
    	            if(this.indexOfId(rec.id) > -1){
    	                this.doUpdate(rec);
    	            }else{
    	                toAdd.push(rec);
    	                ++cnt;
    	            }
    	        }
    	        this.totalLength = Math.max(t, this.data.length + cnt);
    	        this.add(toAdd);
    	        this.fireEvent('load', this, toAdd, options);
            }
            //调用回调方法
            if(options.callback){
                options.callback.call(options.scope || this, o.records, options, true);
            }
        },
        
        // private
        collapse: function(record, deep, callback, scope){
            var me = this,
                node = record.node;
            if(node != undefined){
                return node.collapse(deep, callback, scope);
            }else if(Ext.isFunction(callback)){
                callback.call(scope || this);
            }
        },
        
        // private
        expand: function(record, deep, callback, scope){
            var me = this,
                node = record.node;
            if(node != undefined){
                return node.expand(deep, callback, scope);
            }else if(Ext.isFunction(callback)){
                callback.call(scope || this);
            }
        },
        
        //private
        onBeforeExpandRecord : function(record, callback, scope){
            var me = this, 
                node = record ? record.node : me.getRootNode();
            if (node.isLoaded()) {
                me.runCallback(callback, scope || node, [node.childNodes]);
            }else if (node.isLoading()) {
                this.on('load', function() {
                    me.runCallback(callback, scope || node, [node.childNodes]);
                }, this, {single: true});
            }else {
                this.load({
                    node: node,
                    callback: function() {
                        me.runCallback(callback, scope || node, [node.childNodes]);
                    }
                });
            }
        },
        
        //private
        onExpandRecord : function(record, childRecord, callback, scope){
            var index = this.indexOf(record),
                toAdd = childRecord || [];
            if(record != undefined){
                toAdd.unshift(record);
                this.remove(record);
            }
            this.insert(index >= 0 ? index : 0, toAdd);
        },
        
        //private
        onBeforeCollapseRecord : function(record, callback, scope){
            var node = record ? record.node : this.getRootNode();
            callback.call(scope || node, node.childNodes);
        },
        
        //private
        onCollapseRecord : function(record, childRecord, callback, scope){
            var toRemove = childRecord || [],
                index;
            if(record != undefined){
                index = this.indexOf(record);
                toRemove.unshift(record);
                this.remove(toRemove);
                this.insert(index >= 0 ? index : 0, [record]);
            }else {
                this.remove(toRemove);
            }
        },
        
        //private
        onRemoveRecord : function(){
            
        },
        
        onBeforeMoveRecord : function(){
            
        },
        
        onMoveRecord : function(){
            
        },
        
        onCreateRecords: function(records, operation, success) { 
            
        }, 
        
        onUpdateRecords: function(records, operation, success){ 
            
        },
        
        onDestroyRecords: function(records, operation, success){ 
            
        }, 
        
        /*sortData : function() {
            var me = this,
                sortInfo  = this.hasMultiSort ? this.multiSortInfo : this.sortInfo,
                direction = sortInfo.direction || "ASC",
                sorters   = sortInfo.sorters,
                sortFns   = [];

            //if we just have a single sorter, pretend it's the first in an array
            if (!this.hasMultiSort) {
                sorters = [{direction: direction, field: sortInfo.field}];
            }

            //create a sorter function for each sorter field/direction combo
            for (var i=0, j = sorters.length; i < j; i++) {
                sortFns.push(this.createSortFunction(sorters[i].field, sorters[i].direction));
            }
            if (sortFns.length == 0) {
                return;
            }
            var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;

            var fn = function(r1, r2) {
              var result = sortFns[0].call(this, r1, r2);
              if (sortFns.length > 1) {
                  for (var i=1, j = sortFns.length; i < j; i++) {
                      result = result || sortFns[i].call(this, r1, r2);
                  }
              }

              return directionModifier * result;
            };
            var root = me.getRootNode();
            me.sortChildNodes(root, fn);
            var rs = [];
            root.cascade(function(node){
                if(!node.isRoot && node.record){
                    rs.push(node.record);
                }
            }, me);
            me.removeAll();
            me.add(rs);
        },*/
        //private
        sortData : function() {
            var me = this,
                sortInfo  = this.hasMultiSort ? this.multiSortInfo : this.sortInfo,
                direction = sortInfo.direction || "ASC",
                sorters   = sortInfo.sorters,
                sortFns   = [];

            //if we just have a single sorter, pretend it's the first in an array
            if (!this.hasMultiSort) {
                sorters = [{direction: direction, field: sortInfo.field}];
            }

            //create a sorter function for each sorter field/direction combo
            /*for (var i=0, j = sorters.length; i < j; i++) {
                sortFns.push(this.createSortFunction(sorters[i].field, sorters[i].direction));
            }*/
            sortFns = this.createSortFunction(sorters);
            /*if (sortFns.length == 0) {
                return;
            }*/
            var root = me.getRootNode();
            //for(var i = 0; i < sortFns.length;i++){
                root.cascade(function(node){
                    if(!node.isLeaf() && node.hasChildNodes()&& node.isExpanded()){
                        //node.sort(sortFns[i]);
                        node.sort(sortFns);
                    }
                }, me);
            //}
            var rs = [];
            root.cascade(function(node){
                if(!node.isRoot && node.record && node.parentNode.isExpanded()){
                    rs.push(node.record);
                }
            }, me);
            me.removeAll();
            me.add(rs);
        },
        
        sortChildNodes:function(node, fn){
            var childNodes = [].concat(node.childNodes);
            while(node.firstChild){
                var child = node.firstChild;
                child.remove();
            }
            var childNodes = this.sortNodeList(childNodes, fn);
            node.appendChild(childNodes);
        },
        
        sortNodeList:function(nodeList, fn){
            if(nodeList.length == 0){
                return [];
            }
            var list = nodeList.sort(fn);
            for(var i = 0, l = list.length; i < l; i++){
                this.sortChildNodes(list[i], fn);
            }
            return list;
        },
        
        /*createSortFunction: function(field, direction) {
            direction = direction || "ASC";
            var directionModifier = direction.toUpperCase() == "DESC" ? -1 : 1;
            var sortType = this.fields.get(field).sortType;
            return function(n1, n2) {
                var r1 = n1.record,
                    r2 = n2.record;
                var v1 = sortType(r1.data[field]),
                    v2 = sortType(r2.data[field]);
                
                return directionModifier * (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0));
            };
        },*/
        createSortFunction: function(sorts) {
            //var sortTypes = this.fields.get(field).sortType;
            var fields = this.fields;
            return function(n1, n2) {
                var r1 = n1.record,
                    r2 = n2.record;
                for(var i = 0; i < sorts.length; i++){
                    var sortType = fields.get(sorts[i].field).sortType;
                    var v1 = sortType(r1.data[sorts[i].field]),
                        v2 = sortType(r2.data[sorts[i].field]);
                    if(v1 == v2){
                        continue;
                    } else{
                        return (sorts[i].direction.toUpperCase() == "DESC" ? -1 : 1)*(v1 > v2 ? 1 : -1);
                    }
                }
                
                return 0;
            };
        },
        
        /**
         * 
         * @param {Function} callback
         * @param {Object} scope
         * @param {Arrays} args
         * @private
         */
        runCallback : function(cb, scope, args){
            if(Ext.isFunction(cb)){
                cb.apply(scope, args);
            }
        }, 
        
        /**
         * destroy
         * @private
         */
        destroy : function(){
            if(!this.isDestroyed){
                var root = this.getRootNode();
                 if(root && root.destroy){
                     root.destroy(true);
                 }
            }
            Rs.ext.grid.TreeStore.superclass.destroy.apply(this, arguments);
        }
        
    });
    
})();