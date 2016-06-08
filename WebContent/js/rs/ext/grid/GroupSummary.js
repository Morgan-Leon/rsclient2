Ext.ns("Rs.ext.grid");

(function(){
    /**
     * @class Rs.ext.grid.GroupSummary
     * @extends Ext.util.Observable
     * A GridPanel plugin that enables dynamic column calculations and a dynamically
     * updated grouped summary row.
     */
    Rs.ext.grid.GroupSummary = Ext.extend(Ext.util.Observable, {
        /**
         * @cfg {Function} summaryRenderer Renderer example:<pre><code>
    summaryRenderer: function(v, params, data){
        return ((v === 0 || v > 1) ? '(' + v +' Tasks)' : '(1 Task)');
    },
         * </code></pre>
         */
        /**
         * @cfg {String} summaryType (Optional) The type of
         * calculation to be used for the column.  For options available see
         * {@link #Calculations}.
         */

        constructor : function(config){
            Ext.apply(this, config);
            Rs.ext.grid.GroupSummary.superclass.constructor.call(this);
        },
        
        init : function(grid){
            this.grid = grid;
            var v = this.view = grid.getView();
            v.doGroupEnd = this.doGroupEnd.createDelegate(this);

            v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
            v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
            v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
            v.afterMethod('onUpdate', this.doUpdate, this);
            v.afterMethod('onRemove', this.doRemove, this);

            if(!this.rowTpl){
                this.rowTpl = new Ext.Template(
                    '<div class="x-grid3-summary-row" style="{tstyle}">',
                    '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                        '<tbody><tr>{cells}</tr></tbody>',
                    '</table></div>'
                );
                this.rowTpl.disableFormats = true;
            }
            this.rowTpl.compile();

            if(!this.cellTpl){
                this.cellTpl = new Ext.Template(
                    '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                    '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on">{value}</div>',
                    "</td>"
                );
                this.cellTpl.disableFormats = true;
            }
            this.cellTpl.compile();
        },

        /**
         * Toggle the display of the summary row on/off
         * @param {Boolean} visible <tt>true</tt> to show the summary, <tt>false</tt> to hide the summary.
         */
        toggleSummaries : function(visible){
            var el = this.grid.getGridEl();
            if(el){
                if(visible === undefined){
                    visible = el.hasClass('x-grid-hide-summary');
                }
                el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
            }
        },

        renderSummary : function(o, cs){
            cs = cs || this.view.getColumnData();
            var cfg = this.grid.getColumnModel().config,
                buf = [], c, p = {}, cf, last = cs.length-1;
            for(var i = 0, len = cs.length; i < len; i++){
                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                if(cf.summaryType || cf.summaryRenderer){
                    p.value = (cf.summaryRenderer || c.renderer)(o.data[c.name], p, o);
                }else{
                    p.value = '';
                }
                if(p.value == undefined || p.value === "") p.value = "&#160;";
                buf[buf.length] = this.cellTpl.apply(p);
            }

            return this.rowTpl.apply({
                tstyle: 'width:'+this.view.getTotalWidth()+';',
                cells: buf.join('')
            });
        },

        /**
         * @private
         * @param {Object} rs
         * @param {Object} cs
         */
        calculate : function(rs, cs){
            var data = {}, r, c, cfg = this.grid.getColumnModel().config, cf;
            for(var j = 0, jlen = rs.length; j < jlen; j++){
                r = rs[j];
                for(var i = 0, len = cs.length; i < len; i++){
                    c = cs[i];
                    cf = cfg[i];
                    if(cf.summaryType){
                        data[c.name] = Rs.ext.grid.GroupSummary.Calculations[cf.summaryType](data[c.name] || 0, r, c.name, data);
                    }
                }
            }
            return data;
        },

        doGroupEnd : function(buf, g, cs, ds, colCount){
            var data = this.calculate(g.rs, cs);
            buf.push('</div>', this.renderSummary({data: data}, cs), '</div>');
        },

        doWidth : function(col, w, tw){
            if(!this.isGrouped()){
                return;
            }
            var gs = this.view.getGroups(),
                len = gs.length,
                i = 0,
                s;
            for(; i < len; ++i){
                s = gs[i].childNodes[2];
                s.style.width = tw;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.width = w;
            }
        },

        doAllWidths : function(ws, tw){
            if(!this.isGrouped()){
                return;
            }
            var gs = this.view.getGroups(),
                len = gs.length,
                i = 0,
                j, 
                s, 
                cells, 
                wlen = ws.length;
                
            for(; i < len; i++){
                s = gs[i].childNodes[2];
                s.style.width = tw;
                s.firstChild.style.width = tw;
                cells = s.firstChild.rows[0].childNodes;
                for(j = 0; j < wlen; j++){
                    cells[j].style.width = ws[j];
                }
            }
        },

        doHidden : function(col, hidden, tw){
            if(!this.isGrouped()){
                return;
            }
            var gs = this.view.getGroups(),
                len = gs.length,
                i = 0,
                s, 
                display = hidden ? 'none' : '';
            for(; i < len; i++){
                s = gs[i].childNodes[2];
                s.style.width = tw;
                s.firstChild.style.width = tw;
                s.firstChild.rows[0].childNodes[col].style.display = display;
            }
        },
        
        isGrouped : function(){
            return !Ext.isEmpty(this.grid.getStore().groupField);
        },

        // Note: requires that all (or the first) record in the
        // group share the same group value. Returns false if the group
        // could not be found.
        refreshSummary : function(groupValue){
            return this.refreshSummaryById(this.view.getGroupId(groupValue));
        },

        getSummaryNode : function(gid){
            var g = Ext.fly(gid, '_gsummary');
            if(g){
                return g.down('.x-grid3-summary-row', true);
            }
            return null;
        },

        refreshSummaryById : function(gid){
            var g = Ext.getDom(gid);
            if(!g){
                return false;
            }
            var rs = [];
            this.grid.getStore().each(function(r){
                if(r._groupId == gid){
                    rs[rs.length] = r;
                }
            });
            var cs = this.view.getColumnData(),
                data = this.calculate(rs, cs),
                markup = this.renderSummary({data: data}, cs),
                existing = this.getSummaryNode(gid);
                
            if(existing){
                g.removeChild(existing);
            }
            Ext.DomHelper.append(g, markup);
            return true;
        },

        doUpdate : function(ds, record){
            this.refreshSummaryById(record._groupId);
        },

        doRemove : function(ds, record, index, isUpdate){
            if(!isUpdate){
                this.refreshSummaryById(record._groupId);
            }
        },

        /**
         * Show a message in the summary row.
         * <pre><code>
    grid.on('afteredit', function(){
        var groupValue = 'Ext Forms: Field Anchoring';
        summary.showSummaryMsg(groupValue, 'Updating Summary...');
    });
         * </code></pre>
         * @param {String} groupValue
         * @param {String} msg Text to use as innerHTML for the summary row.
         */
        showSummaryMsg : function(groupValue, msg){
            var gid = this.view.getGroupId(groupValue),
                 node = this.getSummaryNode(gid);
            if(node){
                node.innerHTML = '<div class="x-grid3-summary-msg">' + msg + '</div>';
            }
        }
    });
    

    /**
     * Calculation types for summary row:</p><div class="mdetail-params"><ul>
     * <li><b><tt>sum</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>count</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>max</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>min</tt></b> : <div class="sub-desc"></div></li>
     * <li><b><tt>average</tt></b> : <div class="sub-desc"></div></li>
     * </ul></div>
     * <p>Custom calculations may be implemented.  An example of
     * custom <code>summaryType=totalCost</code>:</p><pre><code>
    // define a custom summary function
    Rs.ext.grid.GroupSummary.Calculations['totalCost'] = function(v, record, field){
        return v + (record.data.estimate * record.data.rate);
    };
     * </code></pre>
     * @property Calculations
     */
    Rs.ext.grid.GroupSummary.Calculations = {
        'sum' : function(v, record, field){
            return v + (record.data[field]||0);
        },

        'count' : function(v, record, field, data){
            return data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
        },

        'max' : function(v, record, field, data){
            var v = record.data[field];
            var max = data[field+'max'] === undefined ? (data[field+'max'] = v) : data[field+'max'];
            return v > max ? (data[field+'max'] = v) : max;
        },

        'min' : function(v, record, field, data){
            var v = record.data[field];
            var min = data[field+'min'] === undefined ? (data[field+'min'] = v) : data[field+'min'];
            return v < min ? (data[field+'min'] = v) : min;
        },

        'average' : function(v, record, field, data){
            var c = data[field+'count'] ? ++data[field+'count'] : (data[field+'count'] = 1);
            var t = (data[field+'total'] = ((data[field+'total']||0) + (record.data[field]||0)));
            return t === 0 ? 0 : t / c;
        }
    };
    
})();