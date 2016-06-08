(function(){
	/**
	 * @class Rs.ext.grid.LockingColumnModel
	 * @extends Ext.grid.ColumnModel
	 * @constructor
	 * @param {Object} config 
	 */
	
	Rs.ext.grid.LockingColumnModel = Ext.extend(Rs.ext.grid.ColumnModel, {
		
	    /**
	     * Returns true if the given column index is currently locked
	     * @param {Number} colIndex The column index
	     * @return {Boolean} True if the column is locked
	     */
	    isLocked : function(colIndex){
	        return this.config[colIndex].columnlocked === true;
	    },
	
	    /**
	     * Locks or unlocks a given column
	     * @param {Number} colIndex The column index
	     * @param {Boolean} value True to lock, false to unlock
	     * @param {Boolean} suppressEvent Pass false to cause the columnlockchange event not to fire
	     */
	    setLocked : function(colIndex, value, suppressEvent){
	        if (this.isLocked(colIndex) == value) {
	            return;
	        }
	        this.config[colIndex].columnlocked = value;
	        if (!suppressEvent) {
	            this.fireEvent('columnlockchange', this, colIndex, value);
	        }
	    },
	
	    /**
	     * Returns the total width of all locked columns
	     * @return {Number} The width of all locked columns
	     */
	    getTotalLockedWidth : function(){
	        var totalWidth = 0;
	        for (var i = 0, len = this.config.length; i < len; i++) {
	            if (this.isLocked(i) && !this.isHidden(i)) {
	                totalWidth += this.getColumnWidth(i);
	            }
	        }
	
	        return totalWidth;
	    },
	
	    /**
	     * Returns the total number of locked columns
	     * @return {Number} The number of locked columns
	     */
	    getLockedCount : function() {
	        var len = this.config.length;
	        
	        var lockCount = 0;
	
	        for (var i = 0; i < len; i++) {
	            if (this.isLocked(i)) {
	                lockCount++;
	            }
	        }
	
	        //if we get to this point all of the columns are locked so we return the total
	        return lockCount;
	    },
	
	    /**
	     * Moves a column from one position to another
	     * @param {Number} oldIndex The current column index
	     * @param {Number} newIndex The destination column index
	     */
	    moveColumn : function(oldIndex, newIndex){
	        var oldLocked = this.isLocked(oldIndex),
	            newLocked = this.isLocked(newIndex);
	
	        if (oldIndex < newIndex && oldLocked && !newLocked) {
	            this.setLocked(oldIndex, false, true);
	        } else if (oldIndex > newIndex && !oldLocked && newLocked) {
	            this.setLocked(oldIndex, true, true);
	        }
	
	        Rs.ext.grid.LockingColumnModel.superclass.moveColumn.apply(this, arguments);
	    }

	});
})();