Ext.ns("Rs.ext.grid");

(function(){
    
    /**
     * @class Rs.ext.grid.TreeColumn  树表格之树列
     * @extends Ext.grid.Column
     * @constructor {Object} cfg
     */
    Rs.ext.grid.TreeColumn = function(cfg){
        cfg = Ext.apply(cfg || {}, {});
        Rs.ext.grid.TreeColumn.superclass.constructor.call(this, cfg);
    };
    
    Ext.extend(Rs.ext.grid.TreeColumn, Ext.grid.Column, {
        
        emptyIcon : Ext.BLANK_IMAGE_URL,
        
        /**
         * @param {Object} value
         * @param {Object} metaData
         * @param {Record} record
         * @param {number} rowIdx
         * @param {number} colIdx
         * @param {Store} store
         * @param {View} view
         * @private
         */
        renderer : function(value, metaData, record, rowIdx, colIdx, store, view) {
            var n = record.node,
                a = n.attributes,
                buf,
                cb = false, //Ext.isBoolean(a.checked),
                href = this.getHref(a.href);
            buf = ['<div class="x-tree-root-ct x-tree-arrows x-tree-root-node x-tree-node"><div ext:tree-node-id="', n.id, 
                   '" class="x-tree-node-el ' + (n.isLeaf()?'x-tree-node-leaf':n.isExpandable()&&n.isExpanded()?'x-tree-node-expanded':'x-tree-node-collapsed') + ' x-unselectable ', a.cls,'" unselectable="on">',
                   '<span class="x-tree-node-indent">', this.getChildIndent(n), "</span>",
                   '<img alt="" src="', this.emptyIcon, '" class="x-tree-ec-icon '+ (n.isLeaf()?"x-tree-elbow-end":n.isExpandable()&&n.isExpanded()?'x-tree-elbow-minus':'x-tree-elbow-plus')+ '" />',
                   '<img alt="" src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
                   cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
                   '<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
                    a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">', value, "</span></a></div>",
                   '<ul class="x-tree-node-ct" style="display:none;"></ul>',
                   "</div>"];
            return buf.join('');
        },
        
        
        //private
        getHref : function(href){
            return Ext.isEmpty(href) ? (Ext.isGecko ? '' : '#') : href;
        }, 
        
        //private
        getChildIndent : function(node){
            var buf = [],
                p = node ? node.parentNode : null;
            while(p){
                if(!p.isRoot || (p.isRoot && p.ownerTree.rootVisible)){
                    if(!p.isLast()) {
                        buf.unshift('<img alt="" src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
                    } else {
                        buf.unshift('<img alt="" src="'+this.emptyIcon+'" class="x-tree-icon" />');
                    }
                }
                p = p.parentNode;
            }
            return buf.join("");
        }, 
        
        //private
        processEvent : function(name, e, grid, rowIndex, colIndex){
            var m = e.getTarget().className.match(/x-tree-ec-icon/);
            if (m) {
                if (name == 'click' || name == 'mousedown') {
                    var store = grid.getStore(), record, node;
                    if(store && (record = store.getAt(rowIndex)) && (node = record.node)){
                        if(node.isExpanded()){
                            store.collapse(record , true);
                        }else {
                            store.expand(record);
                        }
                    }
                }
            }
            return Rs.ext.grid.TreeColumn.superclass.processEvent.apply(this, arguments);
        }
        
    });

    Ext.grid.Column.types['treecolumn'] = Rs.ext.grid.TreeColumn;   
    
})();