Rs.define('rs.app.template.maintenance.BuildInPanel', {
    
    extend : Ext.grid.PropertyGrid,
    
    mixins : [Rs.app.Main], 
    
    save : function(){

        var newDimInfo = this.getSource();
        if(newDimInfo[this.attributes[0]].length==0 || newDimInfo[this.attributes[1]].length==0){
            alert("��˾�ͱ��۲���Ϊ��");
            return;
        }
        var dimAttributes = [];
        for(var i = 0; i < this.attributes.length ; i++){
            dimAttributes[i] = newDimInfo[this.attributes[i]];
        }
        this.setSource({
            "��˾" : "",
            "����" : "",
            "������" : ""
        });
        this.fireEvent('addnew', dimAttributes);
    },
    
    constructor : function(config){
        rs.app.template.maintenance.BuildInPanel.superclass.constructor.call(this, Rs.apply(config || {},{

            source : {
                "��˾" : "",
                "����" : "",
                "������" : ""
            },
            
            attributes : [ "��˾", "����", "������"],
            
            bbar : ["->",new Ext.Button({
                    text:"����",
                    iconCls : "rs-action-save",
                    handler: this.save,
                    scope:this
                }),new Ext.Button({text:"����",iconCls : "rs-action-reset", handler : function(){
                    this.setSource({
                        "��˾" : "",
                        "����" : "",
                        "������" : ""
                    });}, scope : this}) ]
        }));
        this.addEvents([
            /**
             * @event adddim
             * �������Ӱ�ťʱ����.
             */
             "addnew"]);
        
        Rs.EventBus.register(this, 'buildinpanel', ['addnew']);
    }
});