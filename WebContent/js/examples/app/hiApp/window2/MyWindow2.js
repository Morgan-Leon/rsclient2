Rs.define('MyWindow2', {

    config : {
        html : '����2'
    },

    constructor : function(config) {
        this.initConfig(config);
    },

    main : function(eingine, region) {
        Rs.get(region.getRawEl()).update(this.getHtml());
    },

    setWidth : function() {

    },

    setHeight : function() {

    }

});