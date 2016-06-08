Rs.define('Center', {

    constructor : function(config) {
        this.initConfig(config);
    },

    main : function(engine, region) {
        var c = region.targetEl, n = c.createChild( {
            html : '北面板'
        }), w = c.createChild( {
            html : '西面板'
        }), e = c.createChild( {
            html : '东面板'
        }), s = c.createChild( {
            html : '南面板'
        }), w1 = c.createChild( {
            html : '窗口1'
        }), w2 = c.createChild( {
            html : '窗口2'
        }), w3 = c.createChild( {
            html : '窗口3'
        });
        n.on('mousedown', function() {
            var np = Rs.getAppEngine().getAppById('north');
            if (np.isOpen()) {
                np.close();
            } else {
                np.open();
            }
        }, this);

        w.on('mousedown', function() {
            var wp = Rs.getAppEngine().getAppById('west');
            if (wp.isOpen()) {
                wp.close();
            } else {
                wp.open();
            }
        }, this);
        e.on('mousedown', function() {
            var ep = Rs.getAppEngine().getAppById('east');
            if (ep.isOpen()) {
                ep.close();
            } else {
                ep.open();
            }
        }, this);
        s.on('mousedown', function() {
            var sp = Rs.getAppEngine().getAppById('south');
            if (sp.isOpen()) {
                sp.close();
            } else {
                sp.open();
            }
        }, this);
        w1.on('mousedown', function() {
            var wp1 = Rs.getAppEngine().getAppById('mywindow');
            if (wp1.isOpen()) {
                wp1.close();
            } else {
                wp1.open();
            }
        }, this);
        w2.on('mousedown', function() {
            var wp2 = Rs.getAppEngine().getAppById('mywindow2');
            if (wp2.isOpen()) {
                wp2.close();
            } else {
                wp2.open();
            }
        }, this);
        w3.on('mousedown', function() {
            var wp3 = Rs.getAppEngine().getAppById('mywindow3');
            if (wp3.isOpen()) {
                wp3.close();
            } else {
                wp3.open();
            }
        }, this);
    },

    setWidth : function() {

    },

    setHeight : function() {

    }

});
