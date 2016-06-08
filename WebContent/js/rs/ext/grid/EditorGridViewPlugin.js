Ext.ns("Rs.ext.grid");

Rs.ext.grid.EditorGridViewPlugin = function(config) {
    Ext.apply(this, config);
};

Ext.extend(Rs.ext.grid.EditorGridViewPlugin, Ext.util.Observable, {
    
    init: function(editorgridpanel) {
        
        var view = editorgridpanel.getView() ;
        
        Ext.apply(view, {
            initTemplates: function() {
                var templates = view.templates || {},
                template, name,

                headerCellTpl = new Ext.Template('<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                    '<div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">',
                    view.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>': '',
                    '{value}', '<img alt="" class="rs-cell-editor" src="', Ext.BLANK_IMAGE_URL, '" />',
                    '<img alt="" class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />', 
                    '</div>', '</td>'),

                rowBodyText = ['<tr class="x-grid3-row-body-tr" style="{bodyStyle}">', 
                    '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">', 
                    '<div class="x-grid3-row-body">{body}</div>', '</td>', '</tr>'].join(""),

                innerText = ['<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">', 
                    '<tbody>', '<tr>{cells}</tr>', view.enableRowBody ? rowBodyText: '', 
                    '</tbody>', '</table>'].join("");

                Ext.applyIf(templates, {
                    hcell: headerCellTpl,
                    cell: view.cellTpl,
                    body: view.bodyTpl,
                    header: view.headerTpl,
                    master: view.masterTpl,
                    row: new Ext.Template('<div class="x-grid3-row {alt}" style="{tstyle}">' + innerText + '</div>'),
                    rowInner: new Ext.Template(innerText)
                });

                for (name in templates) {
                    template = templates[name];

                    if (template && Ext.isFunction(template.compile) && !template.compiled) {
                        template.disableFormats = true;
                        template.compile();
                    }
                }

                view.templates = templates;
                view.colRe = new RegExp('x-grid3-td-([^\\s]+)', '');
            },
            
            
            // private
            render : function() {
                if (this.autoFill) {
                    var ct = this.grid.ownerCt;
                    
                    if (ct && ct.getLayout()) {
                        ct.on('afterlayout', function() {
                            this.fitColumns(true, true);
                            this.updateHeaders();
                            this.updateHeaderSortState();
                        }, this, {single: true});
                    }
                } else if (this.forceFit) {
                    this.fitColumns(true, false);
                } else if (this.grid.autoExpandColumn) {
                    this.autoExpand(true);
                }
                
                this.grid.getGridEl().dom.innerHTML = this.renderUI();
                
                this.afterRenderUI();
                this.updateEditorPen();
            },
            
            //private
            updateEditorPen: function() {
                var columnModelConfig = view.cm.config;
                for (var i = 0,
                len = columnModelConfig.length; i < len; i++) {
                    var c = columnModelConfig[i];
                    if (c.editor) {
                        view.mainHd.select('td').item(i).addClass("rs-grid-editor");
                    }
                }
            },

            onDataChange : function(){
                this.refresh(true);
                this.updateHeaderSortState();
                this.updateEditorPen();
                this.syncFocusEl(0);
            } ,
            
            onColumnMove : function(cm, oldIndex, newIndex) {
                this.indexMap = null;
                this.refresh(true);
                this.updateEditorPen();
                this.restoreScroll(this.getScrollState());
                
                this.afterMove(newIndex);
                this.grid.fireEvent('columnmove', oldIndex, newIndex);
            }
        });
    }
});