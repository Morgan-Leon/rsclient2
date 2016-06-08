Rs.define('rs.app.template.maintenance.DimAddPanel', {
    
    extend : Ext.grid.PropertyGrid,
    
    mixins : [Rs.app.Main], 
    
    save : function(){

        var newDimInfo = this.getSource();
        if(newDimInfo[this.attributes[0]].length==0 || newDimInfo[this.attributes[1]].length==0){
            alert("ά�ȱ�ʶ��ά����������Ϊ��");
            return;
        }
        var dimAttributes = [];
        for(var i = 2; i < this.attributes.length ; i++){
            dimAttributes[i-2] = newDimInfo[this.attributes[i]];
        }
        this.setSource({
            "ά�ȱ�ʶ" : "",
            "ά������" : "",
            "��" : "",
            "����" :"",
            "����" :"",
            "��" : "",
            "��" : ""
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
                "ά�ȱ�ʶ" : "",
                "ά������" : "",
                "��" : "",
                "����" :"",
                "����" :"",
                "��" : "",
                "��" : ""
            },
            
            attributes : [ "ά�ȱ�ʶ", "ά������", "��", "����", "����", "��", "��"],
            
            bbar : ["->",new Ext.Button({
                    text:"����",
                    iconCls : "rs-action-save",
                    handler: this.save,
                    scope:this
                }),new Ext.Button({text:"����",iconCls : "rs-action-reset"}) ],
            
            onAddNewDim : function(flag){
                if(flag){
                    this.fireEvent("addDim");
                }
            }
        }));
        this.addEvents([
            /**
             * @event adddim
             * �������Ӱ�ťʱ����.
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