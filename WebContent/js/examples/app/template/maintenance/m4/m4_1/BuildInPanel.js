Rs.define('rs.app.template.maintenance.BuildInPanel', {
    
    extend : Ext.grid.PropertyGrid,
    
    mixins : [Rs.app.Main], 
    
    save : function(){

        var newDimInfo = this.getSource();
        if(newDimInfo[this.attributes[0]].length==0 || newDimInfo[this.attributes[1]].length==0){
            alert("公司和报价不能为空");
            return;
        }
        var dimAttributes = [];
        for(var i = 0; i < this.attributes.length ; i++){
            dimAttributes[i] = newDimInfo[this.attributes[i]];
        }
        this.setSource({
            "公司" : "",
            "报价" : "",
            "增长率" : ""
        });
        this.fireEvent('addnew', dimAttributes);
    },
    
    constructor : function(config){
        rs.app.template.maintenance.BuildInPanel.superclass.constructor.call(this, Rs.apply(config || {},{

            source : {
                "公司" : "",
                "报价" : "",
                "增长率" : ""
            },
            
            attributes : [ "公司", "报价", "增长率"],
            
            bbar : ["->",new Ext.Button({
                    text:"保存",
                    iconCls : "rs-action-save",
                    handler: this.save,
                    scope:this
                }),new Ext.Button({text:"重置",iconCls : "rs-action-reset", handler : function(){
                    this.setSource({
                        "公司" : "",
                        "报价" : "",
                        "增长率" : ""
                    });}, scope : this}) ]
        }));
        this.addEvents([
            /**
             * @event adddim
             * 当点击添加按钮时触发.
             */
             "addnew"]);
        
        Rs.EventBus.register(this, 'buildinpanel', ['addnew']);
    }
});