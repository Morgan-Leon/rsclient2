Rs.define('rs.app.DGrid',{
    main : function (engine, region){
        this.grid = new dhtmlXGridObject(region.getRawEl());
        this.grid.setHeader("Sales,Book Title");

        this.grid.setInitWidths("50,150");
        this.grid.setImagePath("/rsc/js/examples/app/dhtmlx/grid/imgs/");
        this.grid.setSkin("dhx_skyblue");
        this.grid.init();
        Rs.Service.call({
            url : "/rsc/js/examples/app/dhtmlx/grid/dataservice.rsc",
            method : "get"
        }, this.setData, this);
    },

    setData : function(d){
        this.grid.parse(d,"jsarray");
    }
});