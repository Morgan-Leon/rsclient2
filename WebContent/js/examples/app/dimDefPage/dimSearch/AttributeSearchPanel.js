Rs.define('AttributeSearchPanel', {
    extend : Ext.grid.PropertyGrid,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
        
        AttributeSearchPanel.superclass.constructor.call(this, Rs.apply(config || {},{

            source : {
                "维度描述" : "",
                "年" : "",
                "半年" :"",
                "季度" :"",
                "月" : "",
                "天" : ""
            },
            
            attributes : [ "维度描述", "年", "半年", "季度", "月", "天"],
            
            bbar : ["->",new Ext.Button({
                    text:"查询",
                    icon:"../../../rs/resources/images/query.png",
                    //handler: this.search,
                    handler:function(){
                        var newDimInfo = this.getSource();
                        var dimAttributes = [];
                        for(var i = 1; i < this.attributes.length ; i++){
                            if(newDimInfo[this.attributes[i]]){
                                dimAttributes[i-1] = newDimInfo[this.attributes[i]];
                            }
                        }
                        this.setSource({
                            "维度描述" : "",
                            "年" : "",
                            "半年" :"",
                            "季度" :"",
                            "月" : "",
                            "天" : ""
                        });
                        this.fireEvent("search",newDimInfo[this.attributes[0]],dimAttributes);
                    },
                    scope:this
                }),new Ext.Button({text:"重置",iconCls : "rs-action-reset"}) ]
        }));
        this.addEvents([
            /**
             * @event search
             * 点击查找按钮时触发.
             * @param {String} desc 用于查找的关键字
             * @param {Array} r 用于查找的相关属性值
             */
             "search"]);
        
        Rs.EventBus.register(this, 'attribute', ['search']);
    }
});