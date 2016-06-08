Ext.ns("Rs.ext.grid");

(function(){
    
    var TreeGridView = function(config){
        TreeGridView.superclass.constructor.call(this, Ext.apply(config || {}, {
            cellSelectorDepth : 5
        }));
    };
    
    Ext.extend(TreeGridView, Ext.grid.GridView, {
        /**
         * @cfg {boolean} autoScrollToTop
         * 当store刷新后是否主动将滚动条移到顶, 默认为false
         * @private
         */
        autoScrollToTop : false,
        
        /**
         * 监听store的load事件.<br>
         * 重写Ext.grid.GridView的onLoad方法，添加判断autoScrollToTop逻辑.
         * @private
         */
        onLoad : function() {
            if(this.autoScrollToTop === true){
                TreeGridView.superclass.onLoad.apply(this, arguments);
            }
        }
        
    });
    
    /**
     * @class Rs.ext.grid.TreeGridPanel
     * 树表格控件<br>
     * 继承自Ext.gridEditorGridPanel<br>
     * @extends Ext.grid.EditorGridPanel
     * @constructor {Object} config
     */
    Rs.ext.grid.TreeGridPanel = function(config){
        Rs.ext.grid.TreeGridPanel.superclass.constructor.call(this, config);
    };
    
    Ext.extend(Rs.ext.grid.TreeGridPanel, Ext.grid.EditorGridPanel, {
        /**
         * Returns the grid's GridView object.
         * 重写EditorGridPanel的getView方法，使用TreeGridView
         * @return {Ext.grid.TreeGridView} The tree grid view
         */
        getView : function() {
            if (!this.view) {
                this.view = new TreeGridView(this.viewConfig);
            }
            return this.view;
        }
        
    });
    Ext.ComponentMgr.registerType("rs-ext-treegridpanel", Rs.ext.grid.TreeGridPanel);
})();