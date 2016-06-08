Ext.ns("Rs.ext.grid");

(function() {

    /**
     * @class Rs.ext.grid.HybridGridSummary
     * 实现服务器端合计和当页数据合计
     * @extend Rs.ext.grid.GridSummary
     * <pre><code>
     *  {
     *      data: [
     *          {
     *              projectId: 100,     project: 'House',
     *              taskId:    112, description: 'Paint',
     *              estimate:    6,        rate:     150,
     *              due:'06/24/2007'
     *          },
     *          ...
     *      ],
     * 
     *      summaryData: {
     *              description: 14, 
     *              estimate: 9,
     *              rate: 99, 
     *              due: new Date(2009, 6, 29),
     *              cost: 999
     *          }
     *  }
     * </code></pre> 
     * 
     */
    Rs.ext.grid.HybridGridSummary = function(config) {
        Rs.ext.grid.HybridGridSummary.superclass.constructor.apply(this, arguments);
    };

    Ext.extend(Rs.ext.grid.HybridGridSummary, Rs.ext.grid.GridSummary, {
        
    	init: function(grid) {
            Rs.ext.grid.HybridGridSummary.superclass.init.apply(this, arguments);    		
    	},
    	
        calculate: function(rs, cs) {
            var gdata = this.getSummaryData();
            return gdata || Rs.ext.grid.HybridGridSummary.superclass.calculate.call(this, rs, cs);
        },

        getSummaryData: function() {
            var reader = this.grid.getStore().reader,
            json = reader.jsonData,
            fields = reader.recordType.prototype.fields,
            v;

            if (json && json.summaryData) {
                v = json.summaryData;
                if (v) {
                    return this.extractValues(v, fields.items, fields.length);
                }
            }
            return null;
        },

        extractValues: function(data, items, len) {
            var reader = this.grid.getStore().reader;
            var cfg = this.cm.config;
            var f, values = {} ;
            for (var j = 0; j < len; j++) {
                f = items[j];
                var v = reader.ef[j](data);
                values[f.name] = f.convert((v !== undefined) ? v: f.defaultValue, data);
            }
            return values;
        },

        /* 
          * @param {Object} data data object
          * @param {Boolean} skipRefresh (Optional) Defaults to false
          * */
        updateSummaryData: function(data, skipRefresh) {
            var json = this.grid.getStore().reader.jsonData;
            if (!json.summaryData) {
                json.summaryData = {};
            }
            json.summaryData = data;
            if (!skipRefresh) {
                this.refreshSummary();
            }
        },
        renderResultValue: function(cf, p, o, c) {
            if (cf.summaryType || cf.summaryRenderer) {
            	var summaryType = cf.summaryType ;
            	var decimalPrecision = 2 ;
            	if(typeof summaryType === 'object'){
            		summaryType = cf.summaryType.type ;
            		decimalPrecision = cf.summaryType.decimalPrecision;
            	}
                var sr = Rs.ext.grid.HybridGridSummary.SummaryRenderer[summaryType];
                var value ;
                if (o.data[c.name]) {
                    value =  (cf.summaryRenderer || sr || c.renderer)(o.data[c.name][summaryType], p, o , decimalPrecision);
                } else {
                    value = (cf.summaryRenderer || sr || c.renderer)(o.data[c.name], p, o , decimalPrecision);
                }
                if(value.search("null") > -1){ //表示有null,需要去掉
                    return '' ;
                } else if (value.search("共:0条") > -1){
                    return '' ;
                }
                return value ;
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
            if (!this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.totalsummary.remove();
            }
            this.view.totalsummary = this.view.totalsummaryWrap.insertHtml('afterbegin', buf, true);
        },

        refreshSumValue: function() {
            if (!this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.totalsummary.remove();
            }
            this.view.totalsummary = this.view.summaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

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
            if (!this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap = Ext.DomHelper.insertAfter(this.view.scroller, {
                    tag: 'div',
                    cls: 'x-grid3-gridsummary-row-inner'
                },
                true);
            } else {
                this.view.totalsummary.remove();
            }
            this.putSumInfo = this.rowTpl.apply({
                tstyle: 'width:' + this.view.getTotalWidth() + ';',
                cells: buf.join('')
            });
            this.view.totalsummary = this.view.totalsummaryWrap.insertHtml('afterbegin', this.putSumInfo, true);
        },

        onLayout: function(vw, vh) {
            if ('number' != Ext.type(vh)) {
                return;
            }
            if (!this.grid.getGridEl().hasClass('x-grid-hide-gridsummary')) {
                this.scroller.setHeight(vh - (this.summary ? this.summary.getHeight() : 0) - this.totalsummary.getHeight());
            }
        },

        /**
         * 解决滚动条问题
         */
        syncSummaryScroll: function() {
            Rs.ext.grid.HybridGridSummary.superclass.syncSummaryScroll.apply(this, arguments);
            var mb = this.view.scroller.dom;
            if (this.view.totalsummaryWrap) {
                this.view.totalsummaryWrap.dom.scrollLeft = mb.scrollLeft;
                this.view.totalsummaryWrap.dom.scrollLeft = mb.scrollLeft;
            }
        },

        doWidth: function(col, w, tw) {
            Rs.ext.grid.HybridGridSummary.superclass.doWidth.apply(this, arguments);
            if (this.view.totalsummary) {
                var s = this.view.totalsummary.dom;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.width = w;
            }
        } ,
        
        doAllWidths: function(ws, tw) {
            var s = this.view.totalsummary.dom,
            wlen = ws.length;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for (var j = 0; j < wlen; j++) {
                cells[j].style.width = ws[j];
            }
        },

        doHidden: function(col, hidden, tw) {
            var s = this.view.totalsummary.dom;
            var display = hidden ? 'none': '';
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
        }

    });

    Rs.ext.grid.HybridGridSummary.SummaryRenderer = {

        'count': function(v, params, data , decimalPrecision) {
            return v ? '共' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , 0) + '条' : '';
        },
        'sum': function(v, params, data , decimalPrecision) {
            return v ? '合计值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        },
        'max': function(v, params, data , decimalPrecision) {
            return v ? '最大值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        },
        'min': function(v, params, data , decimalPrecision) {
            return v ? '最小值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        },
        'average': function(v, params, data , decimalPrecision) {
            return v ? '平均值:' +  Rs.ext.form.NumberField.rendererMillesimalMark(v , decimalPrecision) : '';
        }
    };

})();