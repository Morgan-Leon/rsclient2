(function(){
	
	/**
	 * @class Rs.ext.grid.RowCellSelectionModel
	 * @extends Ext.grid.RowSelectionModel
	 * 
	 * 当选中单元格的时候，按住Ctrl+C 可进行复制选中单元格的内容。不支持chrome 和safri浏览器的复制。
	 *<pre><code>
  var grid = new Ext.grid.GridPanel({
        store: store,
        sm : new Rs.ext.grid.RowCellSelectionModel(),
        title : 'Rs.ext.grid.RowCellSelectionModel',
        columns: [{
                header   : 'CODE', 
                width    : 170,
                sortable : true, 
                dataIndex: 'CODE'
            }, {
                header   : 'NAME', 
                width    : 150, 
                sortable : true, 
                dataIndex: 'NAME'
            }, {
            	header   : 'PRICE', 
                width    : 100, 
                sortable : true, 
                dataIndex: 'PRICE'
            }
        ],
        height: 350,
        width: 500
    });
	 *</code></pre>
	 * @constructor
	 * @param {Object} config The configuration options
	 */
	Rs.ext.grid.RowCellSelectionModel = function(config){
		Rs.ext.grid.RowCellSelectionModel.superclass.constructor.call(this, config);
		
		this.cellselection = null;
		
		this.addEvents(
	        /**
	         * @event beforecellselect
	         * Fires before a cell is selected, return false to cancel the selection.
	         * @param {SelectionModel} this
	         * @param {Number} rowIndex The selected row index
	         * @param {Number} colIndex The selected cell index
	         */
	        "beforecellselect",
	        /**
	         * @event cellselect
	         * Fires when a cell is selected.
	         * @param {SelectionModel} this
	         * @param {Number} rowIndex The selected row index
	         * @param {Number} colIndex The selected cell index
	         */
	        "cellselect", 
	        
	        /**
	         * @event cellselectionchange
	         * Fires when the active cellselection changes.
	         * @param {SelectionModel} this
	         * @param {Object} selection null for no selection or an object with two properties
	         * <div class="mdetail-params"><ul>
	         * <li><b>cell</b> : see {@link #getSelectedCell} 
	         * <li><b>record</b> : Ext.data.record<p class="sub-desc">The {@link Ext.data.Record Record}
	         * which provides the data for the row containing the selection</p></li>
	         * </ul></div>
	         */
	        "cellselectionchange"
	    );
		
	};
	
	Ext.extend(Rs.ext.grid.RowCellSelectionModel, Ext.grid.RowSelectionModel, {
		
		// private
	    initEvents : function(){
			Rs.ext.grid.RowCellSelectionModel.superclass.initEvents.apply(this, arguments);
			this.grid.on('cellmousedown', this.handleCellMouseDown, this);
	        this.grid.on(Ext.EventManager.getKeyEvent(), this.handleKeyDown, this);
	        this.grid.getView().on({
	            scope: this,
	            refresh: this.onViewChange,
	            rowupdated: this.onRowUpdated,
	            beforerowremoved: this.clearCellSelections,
	            beforerowsinserted: this.clearCellSelections
	        });
	        if(this.grid.isEditor){
	            this.grid.on('beforeedit', this.beforeEdit,  this);
	        }
	    },
	    
	    //private
	    beforeEdit : function(e){
	        this.select(e.row, e.column, false, true, e.record);
	    },
	    
	    //private
	    onViewChange : function(){
	        this.clearCellSelections(true);
	    },
	    
	    //private
	    onRowUpdated : function(v, index, r){
	        if(this.cellselection && this.cellselection.record == r){
	            v.onCellSelect(index, this.cellselection.cell[1]);
	        }
	    },
	    
	    //private
	    handleCellMouseDown : function(g, row, cell, e){
            if(e.button !== 0 || this.isLocked()){
                return;
            }
            this.select(row, cell);
        },
	    
        /**
	     * Selects a cell.  Before selecting a cell, fires the
	     * {@link #beforecellselect} event.  If this check is satisfied the cell
	     * will be selected and followed up by  firing the {@link #cellselect} and
	     * {@link #selectionchange} events.
	     * @param {Number} rowIndex The index of the row to select
	     * @param {Number} colIndex The index of the column to select
	     * @param {Boolean} preventViewNotify (optional) Specify <tt>true</tt> to
	     * prevent notifying the view (disables updating the selected appearance)
	     * @param {Boolean} preventFocus (optional) Whether to prevent the cell at
	     * the specified rowIndex / colIndex from being focused.
	     * @param {Ext.data.Record} r (optional) The record to select
	     */
	    select : function(rowIndex, colIndex, preventViewNotify, preventFocus, /*internal*/ r){
	        if(this.fireEvent("beforecellselect", this, rowIndex, colIndex) !== false){
	            this.clearCellSelections();
	            r = r || this.grid.store.getAt(rowIndex);
	            this.cellselection = {
	                record : r,
	                cell : [rowIndex, colIndex]
	            };
	            if(!preventViewNotify){
	                var v = this.grid.getView();
	                v.onCellSelect(rowIndex, colIndex);
	                if(preventFocus !== true){
	                    v.focusCell(rowIndex, colIndex);
	                }
	            }
	            this.fireEvent("cellselect", this, rowIndex, colIndex);
	            this.fireEvent("cellselectionchange", this, this.cellselection);
	        }
	    },
	    
	    /**
	     * If anything is selected, clears all selections and fires the selectionchange event.
	     * @param {Boolean} preventNotify <tt>true</tt> to prevent the gridview from
	     * being notified about the change.
	     */
	    clearCellSelections : function(preventNotify){
	        var cs = this.cellselection;
	        if(cs){
	            if(preventNotify !== true){
	                this.grid.view.onCellDeselect(cs.cell[0], cs.cell[1]);
	            }
	            this.cellselection = null;
	            this.fireEvent("cellselectionchange", this, null);
	        }
	    },
	    
		/**
	     * Returns an array containing the row and column indexes of the currently selected cell
	     * (e.g., [0, 0]), or null if none selected. The array has elements:
	     * <div class="mdetail-params"><ul>
	     * <li><b>rowIndex</b> : Number<p class="sub-desc">The index of the selected row</p></li>
	     * <li><b>cellIndex</b> : Number<p class="sub-desc">The index of the selected cell. 
	     * Due to possible column reordering, the cellIndex should <b>not</b> be used as an
	     * index into the Record's data. Instead, use the cellIndex to determine the <i>name</i>
	     * of the selected cell and use the field name to retrieve the data value from the record:<pre><code>
	// get name
	var fieldName = grid.getColumnModel().getDataIndex(cellIndex);
	// get data value based on name
	var data = record.get(fieldName);
	     * </code></pre></p></li>
	     * </ul></div>
	     * @return {Array} An array containing the row and column indexes of the selected cell, or null if none selected.
		 */
	    getSelectedCell : function(){
	        return this.cellselection ? this.cellselection.cell : null;
	    }, 
	    
	    /**
	     * Returns <tt>true</tt> if there is a selection.
	     * @return {Boolean}
	     */
	    hasCellSelection : function(){
	        return this.cellselection ? true : false;
	    },
	    
		//private
	    isSelectable : function(rowIndex, colIndex, cm){
	    	return !cm.isHidden(colIndex);
	    },
	    
	    /** @ignore */
	    handleKeyDown : function(e){
	    	if(e.getKey() == e.C && e.ctrlKey === true){
	    		var g = this.grid,
	    			cs = this.cellselection, cm, f, r;
	    		if(g && cs){
	    			cm = g.getColumnModel();
	    			c = cm.getColumnAt(cs.cell[1]);
	    			f = c ? c.dataIndex : undefined;
	    			r = cs.record;
	    			if(r && f){
	    				Rs.Clipboard.setData(r.get(f));
	    			}
	    		}
	    		return;
	    	}
	        if(!e.isNavKeyPress()){
	            return;
	        }
	        var k = e.getKey(),
	            g = this.grid,
	            s = this.cellselection,
	            sm = this,
	            walk = function(row, col, step){
	                return g.walkCells(
	                    row,
	                    col,
	                    step,
	                    g.isEditor && g.editing ? sm.acceptsNav : sm.isSelectable, // *** handle tabbing while editorgrid is in edit mode
	                    sm
	                );
	            },
	            cell, newCell, r, c, ae;

	        switch(k){
	            case e.ESC:
	            case e.PAGE_UP:
	            case e.PAGE_DOWN:
	                // do nothing
	                break;
	            default:
	                // *** call e.stopEvent() only for non ESC, PAGE UP/DOWN KEYS
	                e.stopEvent();
	                break;
	        }

	        if(!s){
	            cell = walk(0, 0, 1); // *** use private walk() function defined above
	            if(cell){
	                this.select(cell[0], cell[1]);
	            }
	            return;
	        }

	        cell = s.cell;  // currently selected cell
	        r = cell[0];    // current row
	        c = cell[1];    // current column
	        
	        switch(k){
	            case e.TAB:
	                if(e.shiftKey){
	                    newCell = walk(r, c - 1, -1);
	                }else{
	                    newCell = walk(r, c + 1, 1);
	                }
	                break;
	            case e.DOWN:
	                newCell = walk(r + 1, c, 1);
	                break;
	            case e.UP:
	                newCell = walk(r - 1, c, -1);
	                break;
	            case e.RIGHT:
	                newCell = walk(r, c + 1, 1);
	                break;
	            case e.LEFT:
	                newCell = walk(r, c - 1, -1);
	                break;
	            case e.ENTER:
	                if (g.isEditor && !g.editing) {
	                    g.startEditing(r, c);
	                    return;
	                }
	                break;
	        }

	        if(newCell){
	            // *** reassign r & c variables to newly-selected cell's row and column
	            r = newCell[0];
	            c = newCell[1];

	            this.select(r, c); // *** highlight newly-selected cell and update selection

	            if(g.isEditor && g.editing){ // *** handle tabbing while editorgrid is in edit mode
	                ae = g.activeEditor;
	                if(ae && ae.field.triggerBlur){
	                    // *** if activeEditor is a TriggerField, explicitly call its triggerBlur() method
	                    ae.field.triggerBlur();
	                }
	                g.startEditing(r, c);
	            }
	        }
	    }
		
	});
	
})();