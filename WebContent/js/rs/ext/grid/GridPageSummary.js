Ext.ns("Rs.ext.grid");

(function() {
    /**
     * @class Rs.ext.grid.GridPageSummary 表格当前页合计行插件
     * @extends Ext.util.Observable
     */
    Rs.ext.grid.GridPageSummary = function(config) {
        Ext.apply(this, config);
    };

    Ext.extend(Rs.ext.grid.GridPageSummary, Ext.util.Observable, {
        init: function(grid) {
            this.grid = grid;
            this.cm = grid.getColumnModel();
            this.view = grid.getView();
            var v = this.view;

            v.doRender = this.doRender.createDelegate(this);
            v.afterMethod('onUpdate', this.refreshPageSummary, this);
            v.afterMethod('onRemove', this.refreshPageSummary, this);

            // update summary row on store's add / remove / clear events
            grid.store.on('add', this.refreshPageSummary, this);
            grid.store.on('remove', this.refreshPageSummary, this);
            grid.store.on('clear', this.refreshPageSummary, this);

            if (!this.cellTpl) {
                this.cellTpl = new Ext.Template('<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div class="x-grid3-pagesummary-cell-inner x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>', '</td>');
            }
            this.cellTpl.compile();

        },

        doRender: function(columns, records, store, startRow, colCount, stripe) {
            var templates = this.view.templates,
            cellTemplate = templates.cell,
            rowTemplate = templates.row,
            last = colCount - 1,
            tstyle = 'width:' + this.view.getTotalWidth() + ';',
            // buffers
            rowBuffer = [],
            colBuffer = [],
            rowParams = {
                tstyle: tstyle
            },
            meta = {},
            len = records.length,
            alt,
            column,
            record,
            i,
            j,
            rowIndex;

            //build up each row's HTML
            for (j = 0; j < len; j++) {
                record = records[j];
                colBuffer = [];

                rowIndex = j + startRow;

                //build up each column's HTML
                for (i = 0; i < colCount; i++) {
                    column = columns[i];
                    meta.id = column.id;
                    meta.css = i === 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                    meta.attr = meta.cellAttr = '';
                    meta.style = column.style;
                    meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);

                    if (Ext.isEmpty(meta.value)) {
                        meta.value = '&#160;';
                    }

                    if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                        meta.css += ' x-grid3-dirty-cell';
                    }

                    colBuffer[colBuffer.length] = cellTemplate.apply(meta);
                }

                alt = [];
                //set up row striping and row dirtiness CSS classes
                if (stripe && ((rowIndex + 1) % 2 === 0)) {
                    alt[0] = 'x-grid3-row-alt';
                }

                if (record.dirty) {
                    alt[1] = ' x-grid3-dirty-row';
                }

                rowParams.cols = colCount;

                if (this.getRowClass) {
                    alt[2] = this.view.getRowClass(record, rowIndex, rowParams, store);
                }

                rowParams.alt = alt.join(' ');
                rowParams.cells = colBuffer.join('');

                rowBuffer[rowBuffer.length] = rowTemplate.apply(rowParams);
            }
            var el = Ext.get(this.view.mainBody.dom.childNodes[this.view.mainBody.dom.childNodes.length - 1]);
            if (el && el.hasClass && el.hasClass('x-grid3-pagesummary-row')) {
                el.remove();
            }
            rowBuffer[rowBuffer.length] = this.refreshSummary();
            return rowBuffer.join('');
        },

        calculate: function(rs, cs) {
            var data = {},
            fieldData = {},
            avgData = {},
            r, c, cfg = this.cm.config,
            cf, oldName;
            var addlineflag = this.addline ? this.addline: 0;
            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                for (var j = 0,
                jlen = rs.length; j < jlen; j++) {
                    r = rs[j];
                    if (cf && cf.summaryType) {
                    	var summaryType = cf.summaryType ;
                    	if(typeof summaryType === 'object'){
                    		summaryType = cf.summaryType.type ;
                    	}
                        if (!data[c.name]) {
                            data[c.name] = {};
                        }
                        data[c.name][summaryType] = Rs.ext.grid.GridSummary.Calculations[summaryType](data[c.name][summaryType] || 0, r, c.name, data[c.name][summaryType], data[c.name]);
                    }
                }
            }
            return data;
        },

        onLayout: function(vw, vh) {
            if ('number' != Ext.type(vh)) {
                return;
            }
            if (!this.grid.getGridEl().hasClass('x-grid-hide-gridsummary')) {
                this.scroller.setHeight(vh - this.summary.getHeight());
            }
        },

        syncSummaryScroll: function() {
            var mb = this.view.scroller.dom;
            this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
            this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
        },

        doWidth: function(col, w, tw) {
            var s = this.view.summary.dom;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.width = w;
        },

        doAllWidths: function(ws, tw) {
            var s = this.view.summary.dom,
            wlen = ws.length;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for (var j = 0; j < wlen; j++) {
                cells[j].style.width = ws[j];
            }
        },

        doHidden: function(col, hidden, tw) {
            var s = this.view.summary.dom;
            var display = hidden ? 'none': '';
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        },
        putSumInfo: null,

        refreshSumValue: function() {
            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        renderSummary: function(o, cs) {
            cs = cs || this.view.getColumnData();
            var cfg = this.cm.config;
            var buf = [],
            c,
            p = {},
            cf,
            last = cs.length - 1,
            pp = {},
            tstyle = 'width:' + this.view.getTotalWidth() + ';',
            rowParams = {
                tstyle: tstyle
            };

            for (var i = 0,
            len = cs.length; i < len; i++) {

                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                var st = cf.summaryType;
                if (st || cf.summaryRenderer) {
                	var summaryType = cf.summaryType ;
                	var decimalPrecision = 2 ;
                	if(typeof summaryType === 'object'){
                		summaryType = cf.summaryType.type ;
                		decimalPrecision = cf.summaryType.decimalPrecision;
                	}
                    var sr = Rs.ext.grid.GridPageSummary.SummaryRenderer[summaryType];
                    p.value = (cf.summaryRenderer || sr || c.renderer)(o.data[c.name][summaryType], p, o , decimalPrecision);
                } else {
                    p.value = '';
                }
                if (p.value == undefined || p.value === "") p.value = "&#160;";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            rowParams.alt = 'x-grid3-pagesummary-row';
            rowParams.cells = buf.join('');

            return rowParams; //this.pageSummary = this.view.templates.row.apply(rowParams);
        },

        refreshSummary: function() {
            if (this.putSumInfo) {
                return this.putSumInfo;
            }
            var g = this.grid,
            ds = g.store;
            var cs = this.view.getColumnData();
            var rs = ds.getRange();
            var data = this.calculate(rs, cs);
            var buf = this.renderSummary({
                data: data
            },
            cs);
            return this.pageSummary = this.view.templates.row.apply(buf);
        },

        refreshPageSummary: function() {
            if (this.putSumInfo) {
                return this.putSumInfo;
            }
            var g = this.grid,
            ds = g.store;
            var cs = this.view.getColumnData();
            var rs = ds.getRange();
            if (this.pageSummary) {
                var data = this.calculate(rs, cs);
                var buf = this.renderSummary({
                    data: data
                },
                cs);
                var row = this.view.mainBody.dom.childNodes[this.view.mainBody.dom.childNodes.length - 1];
                row.innerHTML = this.view.templates.rowInner.apply(buf);
            }
        },

        toggleSummary: function(visible) {
            var el = this.grid.getGridEl();
            if (el) {
                if (visible === undefined) {
                    visible = el.hasClass('x-grid-hide-gridsummary');
                }
                el[visible ? 'removeClass': 'addClass']('x-grid-hide-gridsummary');
                this.view.layout();
            }
        },

        /**
         * 获取合计行
         * 
         * @return {HTMLElement/Ext.Element}
         */
        getSummaryNode: function() {
            return this.view.summary;
        }
    });

    Rs.ext.grid.GridPageSummary.SummaryRenderer = {

		'count' : function(v, params, data , decimalPrecision) {
            return v ? '共' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , 0) + '条' : '';
        },
        'sum' : function(v, params, data , decimalPrecision) {
            return v ? '合计值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        },
        'max' : function(v, params, data, decimalPrecision) {
            return v ? '最大值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        },
        'min' : function(v, params, data, decimalPrecision) {
            return v ? '最小值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        },
        'average' : function(v, params, data, decimalPrecision) {
            return v ? '平均值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        }
    };
})();