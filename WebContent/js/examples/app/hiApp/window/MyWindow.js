Rs.define('MyWindow', {

    config : {
        html : '����'
    },

    constructor : function(config) {
        this.initConfig(config);
    },

    main : function(eingine, region) {
        Rs.get(region.gerRawEl()).update(this.getHtml());
    },

    setWidth : function() {

    },

    setHeight : function() {

    }

});