Rs.define('East', {

    config : {
        html : '¶«'
    },

    constructor : function(config) {
        this.initConfig(config);
    },

    main : function(engine, region) {
        var ct = this.ct = Rs.get(region.getRawEl());
        ct.update(this.getHtml());
    },

    setWidth : function(w) {
        ct.setWidth(w);
    },

    setHeight : function(h) {
        ct.setHeight(h);
    }

});