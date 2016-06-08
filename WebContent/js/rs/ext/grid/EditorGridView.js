(function(){
    /**
     * @class Rs.ext.grid.EditorGridView
     * @extends Ext.grid.GridView
     * @constructor
     * @param {Object} config 
     */

    Rs.ext.grid.EditorGridView = Ext.extend(Ext.grid.GridView, {
        
        initTemplates : function() {
            var templates = this.templates || {},
                template, name,
                
                headerCellTpl = new Ext.Template(
                    '<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                        '<div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', 
                            this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
                            '{value}',
                            '<img alt="" class="rs-cell-editor" src="', Ext.BLANK_IMAGE_URL, '" />',
                            '<img alt="" class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
                        '</div>',
                    '</td>'
                ),
            
                rowBodyText = [
                    '<tr class="x-grid3-row-body-tr" style="{bodyStyle}">',
                        '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">',
                            '<div class="x-grid3-row-body">{body}</div>',
                        '</td>',
                    '</tr>'
                ].join(""),
            
                innerText = [
                    '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                         '<tbody>',
                            '<tr>{cells}</tr>',
                            this.enableRowBody ? rowBodyText : '',
                         '</tbody>',
                    '</table>'
                ].join("");
            
            Ext.applyIf(templates, {
                hcell   : headerCellTpl,
                cell    : this.cellTpl,
                body    : this.bodyTpl,
                header  : this.headerTpl,
                master  : this.masterTpl,
                row     : new Ext.Template('<div class="x-grid3-row {alt}" style="{tstyle}">' + innerText + '</div>'),
                rowInner: new Ext.Template(innerText)
            });
    
            for (name in templates) {
                template = templates[name];
                
                if (template && Ext.isFunction(template.compile) && !template.compiled) {
                    template.disableFormats = true;
                    template.compile();
                }
            }
    
            this.templates = templates;
            this.colRe = new RegExp('x-grid3-td-([^\\s]+)', '');
        },
        
        updateEditorPen : function(){
            var columnModelConfig = this.cm.config ;
            for(var i=0,len=columnModelConfig.length;i<len;i++){
                var c = columnModelConfig[i] ;
                if(c.editor){
                    this.mainHd.select('td').item(i).addClass("rs-grid-editor");
                }
            }
        },
        
        /**
         * @private
         * Ensures the given column has the given icon class
         */
        updateSortIcon : function(col, dir) {
            var sortClasses = this.sortClasses,
                sortClass   = sortClasses[dir == "DESC" ? 1 : 0],
                headers     = this.mainHd.select('td').removeClass(sortClasses);
            
            headers.item(col).addClass(sortClass);
            
            this.updateEditorPen();
        }
    })
})();