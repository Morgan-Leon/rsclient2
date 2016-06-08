Rs.define('AttributeSearchPanel', {
    extend : Ext.grid.PropertyGrid,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
        
        AttributeSearchPanel.superclass.constructor.call(this, Rs.apply(config || {},{

            source : {
                "ά������" : "",
                "��" : "",
                "����" :"",
                "����" :"",
                "��" : "",
                "��" : ""
            },
            
            attributes : [ "ά������", "��", "����", "����", "��", "��"],
            
            bbar : ["->",new Ext.Button({
                    text:"��ѯ",
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
                            "ά������" : "",
                            "��" : "",
                            "����" :"",
                            "����" :"",
                            "��" : "",
                            "��" : ""
                        });
                        this.fireEvent("search",newDimInfo[this.attributes[0]],dimAttributes);
                    },
                    scope:this
                }),new Ext.Button({text:"����",iconCls : "rs-action-reset"}) ]
        }));
        this.addEvents([
            /**
             * @event search
             * ������Ұ�ťʱ����.
             * @param {String} desc ���ڲ��ҵĹؼ���
             * @param {Array} r ���ڲ��ҵ��������ֵ
             */
             "search"]);
        
        Rs.EventBus.register(this, 'attribute', ['search']);
    }
});