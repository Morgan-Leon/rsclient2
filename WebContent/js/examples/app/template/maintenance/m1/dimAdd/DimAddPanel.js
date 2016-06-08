Rs.define('rs.app.template.maintenance.DimAddPanel', {
    
    extend : Ext.grid.PropertyGrid,
    
    mixins : [Rs.app.Main], 
    
    save : function(){

        var newDimInfo = this.getSource();
        if(newDimInfo[this.attributes[0]].length==0 || newDimInfo[this.attributes[1]].length==0){
            alert("维度标识和维度描述不能为空");
            return;
        }
        var dimAttributes = [];
        for(var i = 2; i < this.attributes.length ; i++){
            dimAttributes[i-2] = newDimInfo[this.attributes[i]];
        }
        this.setSource({
            "维度标识" : "",
            "维度描述" : "",
            "年" : "",
            "半年" :"",
            "季度" :"",
            "月" : "",
            "天" : ""
        });
        Rs.Service.call({
            url : "dataservice.jsp",
            method : "addSubMember",
            params : {
                pId : this.pnode.dimId,
                plevel : this.pnode.level,
                identifier : newDimInfo[this.attributes[0]],
                desc : newDimInfo[this.attributes[1]],
                dimAttributes : dimAttributes
            }
        }, this.onAddNewDim, this);
    },
    
    constructor : function(config){
        rs.app.template.maintenance.DimAddPanel.superclass.constructor.call(this, Rs.apply(config || {},{

            source : {
                "维度标识" : "",
                "维度描述" : "",
                "年" : "",
                "半年" :"",
                "季度" :"",
                "月" : "",
                "天" : ""
            },
            
            attributes : [ "维度标识", "维度描述", "年", "半年", "季度", "月", "天"],
            
            bbar : ["->",new Ext.Button({
                    text:"保存",
                    iconCls : "rs-action-save",
                    handler: this.save,
                    scope:this
                }),new Ext.Button({text:"重置",iconCls : "rs-action-reset"}) ],
            
            onAddNewDim : function(flag){
                if(flag){
                    this.fireEvent("addDim");
                }
            }
        }));
        this.addEvents([
            /**
             * @event adddim
             * 当点击添加按钮时触发.
             */
             "adddim"]);
        
        Rs.EventBus.register(this, 'addwindow', ['adddim']);
        //Rs.EventBus.on('info-add', this.onInfoAdd, this);

        Rs.EventBus.on('tree-click', this.onTreeClick, this);
    },
    
    onTreeClick : function(n, e){
        this.pnode = n ? n.attributes : {};
    }
});