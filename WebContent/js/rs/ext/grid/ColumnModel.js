Ext.ns("Rs.ext.grid");

(function() {
    
    Rs.ext.grid.ColumnModel = Ext.extend(Ext.grid.ColumnModel, {
        getColumnHeader : function(col) {
            var editor = this.config[col].editor ;
            if(editor == null || editor == undefined){
                return this.config[col].header;
            }
            var header = this.config[col].header ;
            return  header + " <span class='rs-cell-editor'>&nbsp;&nbsp;&nbsp;&nbsp;</span>";
        }
    });
    
})();