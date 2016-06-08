/*!
 * Ext JS Library 3.3.1
 * Copyright(c) 2006-2010 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

/**
 * @class Ext.ux.tree.TreeGridNode
 * @extends Ext.tree.TreeNode
 * @author changtiger
 */
Ext.ux.tree.TreeGridNode = Ext.extend(Ext.tree.TreeNode, {
	renderChildren : function(suppressEvent) {
		if (suppressEvent !== false) {
			this.fireEvent('beforechildrenrendered', this);
		}
		
		var cs = this.childNodes;
		var tw = this.getOwnerTree().innerCt.getWidth();
		for ( var i = 0, len = cs.length; i < len; i++) {
			cs[i].render(true, tw);
		}
		this.childrenRendered = true;
	}
});
