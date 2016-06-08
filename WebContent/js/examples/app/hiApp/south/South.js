Rs.define('South', {

    config : {
        html : 'до'
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