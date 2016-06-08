Ext.ns("Rs.ext.grid");

(function() {
    /**
     * @class Rs.ext.grid.GridSummary 表格当前页合计行插件
     * @extends Ext.util.Observable
     */
    Rs.ext.grid.GridSummary = function(config) {
        Ext.apply(this, config);
    };

    Ext.extend(Rs.ext.grid.GridSummary, Ext.util.Observable, {
        init: function(grid) {
            this.grid = grid;
            this.cm = grid.getColumnModel();
            this.view = grid.getView();
            var v = this.view;

            v.onLayout = this.onLayout;

            v.afterMethod('render', this.refreshSummary, this);
            v.afterMethod('refresh', this.refreshSummary, this);
            v.afterMethod('setSumValue', this.test, this);
            v.afterMethod('syncScroll', this.syncSummaryScroll, this);
            v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
            v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
            v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
            v.afterMethod('onUpdate', this.refreshSummary, this);
            v.afterMethod('onRemove', this.refreshSummary, this);

            // update summary row on store's add / remove / clear events
            grid.store.on('add', this.refreshSummary, this);
            grid.store.on('remove', this.refreshSummary, this);
            grid.store.on('clear', this.refreshSummary, this);

            if (!this.rowTpl) {
                this.rowTpl = new Ext.Template('<div class="x-grid3-summary-row x-grid3-gridsummary-row-offset">', '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">', '<tbody><tr>{cells}</tr></tbody>', '</table>', '</div>');
                this.rowTpl.disableFormats = true;
            }
            this.rowTpl.compile();

            if (!this.cellTpl) {
                this.cellTpl = new Ext.Template('<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">', '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>', "</td>");
                this.cellTpl.disableFormats = true;
            }
            this.cellTpl.compile();
        },

        calculate: function(rs, cs) {
            var data = {},
            fieldData = {},
            avgData = {},
            r, c, cfg = this.cm.config,
            cf;
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
            if (this.view.summaryWrap) {
                this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
                this.view.summaryWrap.dom.scrollLeft = mb.scrollLeft;
            }
        },

        doWidth: function(col, w, tw) {
            if (this.view.summary) {
                var s = this.view.summary.dom;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.width = w;
            }
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
        setSumValue: function(jsonV) {
            var cs = this.view.getColumnData();
            var buf = [],
            c,
            p = {},
            last = cs.length - 1;

            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                if (jsonV && jsonV[c.name]) {
                    p.value = jsonV[c.name];
                } else {
                    p.value = '';
                }
                if (p.value == undefined || p.value === "") p.value = " ";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.putSumInfo = this.rowTpl.apply({
                tstyle: 'width:' + this.view.getTotalWidth() + ';',
                cells: buf.join('')
            });
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

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
            last = cs.length - 1;

            for (var i = 0,
            len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ': (i == last ? 'x-grid3-cell-last ': '');
                p.value = this.renderResultValue(cf, p, o, c);
                if (p.value == undefined || p.value === "") p.value = "&#160;";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            return this.rowTpl.apply({
                tstyle: 'width:' + this.view.getTotalWidth() + ';',
                cells: buf.join('')
            });
        },
        renderResultValue: function(cf, p, o, c) {
            if (cf.summaryType || cf.summaryRenderer) {
            	var summaryType = cf.summaryType ;
            	var decimalPrecision = 2 ;
            	if(typeof summaryType === 'object'){
            		summaryType = cf.summaryType.type ;
            		decimalPrecision = cf.summaryType.decimalPrecision;
            	}
            	var sr = Rs.ext.grid.GridSummary.SummaryRenderer[summaryType];
                if (o.data[c.name]) {
                    return (cf.summaryRenderer || sr || c.renderer)(o.data[c.name][summaryType], p, o , decimalPrecision);
                } else {
                    return (cf.summaryRenderer || sr || c.renderer)(o.data[c.name], p, o , decimalPrecision);
                }
            } else {
                return '';
            }
        },
        refreshSummary: function() {
            if (this.putSumInfo) {
                this.refreshSumValue(this.putSumInfo);
                return;
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

            if (!this.view.summaryWrap) {
                this.view.summaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.summary.remove();
            }
            this.view.summary = this.view.summaryWrap.insertHtml('afterbegin', buf, true);
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

    Rs.ext.grid.GridSummary.Calculations = {

        'sum': function(v, record, field) {
            return v + Ext.num(record.data[field], 0);
        },

        'count': function(v, record, field, data) {
            return data ? ++data: (data = 1);
        },

        'max': function(v, record, field, data) {
            var v = record.data[field];
            var max = (data === undefined) || (data == 0) ? (data = v) : data;
            return Math.max(v, max);
        },

        'min': function(v, record, field, data) {
            var v = parseFloat(record.data[field]);
            var min = (data === undefined) || (data == 0) ? (data = v) : data;
            return Math.min(v, min);
        },

        'average': function(v, record, field, data, avgData) {

            var c = avgData['count_avg'] ? ++avgData['count_avg'] : (avgData['count_avg'] = 1);
            var t = (avgData['total'] = (parseFloat(avgData['total'] || 0) + (Ext.num(record.data[field] || 0))));

            return t === 0 ? 0 : t / c;
        }
    };

    Rs.ext.grid.GridSummary.SummaryRenderer = {

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