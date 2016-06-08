//定义类WarehouseDefinitionPanel
Rs.define('rs.inv.WarehouseDefinitionPanel', {
    extend: Ext.Panel,//继承Ext.Panel,如果是做嵌套的模版,一般都继承于Ext.Panel
    mixins: [Rs.app.Main],//入口的类需要混合一个入口函数,类似java的主类中的Main方法
    constructor: function(config) {//构造方法
        
    	this.grid = new rs.inv.WarehouseDefinitionGrid({
        	region: 'center'//布局在中间
        });
        
        this.query = new rs.inv.WarehouseDefinitionQuery({
            region: 'north',//布局在北方
            animCollapse : false,//收缩面板是否附带动画效果
            grid: this.grid //让查询面板引用grid表格面板
        });
        config = Rs.apply(config || {},
        {	
            layout: 'border',//这个面板以border布局
            title : '仓库定义', //标题
            items: [this.grid, this.query] //将表格面板以及查询面板布局在panle中
        });
        rs.inv.WarehouseDefinitionPanel.superclass.constructor.apply(this,arguments);
    }
});
