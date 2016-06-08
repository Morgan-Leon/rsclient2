Rs.lib.Point = function(x, y) {
	if(Rs.isArray(x)) {
		y = x[1];
		x = x[0];
	}
	var me = this;
	me.x = me.right = me.left = me[0] = x;
	me.y = me.top = me.bottom = me[1] = y;
};

Rs.lib.Point.prototype = new Rs.lib.Region();
