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
         * ��storeˢ�º��Ƿ��������������Ƶ���, Ĭ��Ϊfalse
         * @private
         */
        autoScrollToTop : false,
        
        /**
         * ����store��load�¼�.<br>
         * ��дExt.grid.GridView��onLoad����������ж�autoScrollToTop�߼�.
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
     * �����ؼ�<br>
     * �̳���Ext.gridEditorGridPanel<br>
     * @extends Ext.grid.EditorGridPanel
     * @constructor {Object} config
     */
    Rs.ext.grid.TreeGridPanel = function(config){
        Rs.ext.grid.TreeGridPanel.superclass.constructor.call(this, config);
    };
    
    Ext.extend(Rs.ext.grid.TreeGridPanel, Ext.grid.EditorGridPanel, {
        /**
         * Returns the grid's GridView object.
         * ��дEditorGridPanel��getView������ʹ��TreeGridView
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