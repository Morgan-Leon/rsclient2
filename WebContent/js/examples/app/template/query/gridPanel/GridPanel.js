Rs.define('rs.app.query.GridPanel',{
    
    extend : Ext.grid.EditorGridPanel,
    
    mixins : [ Rs.app.Main ],
    
    constructor : function(config) {
        this.myData = [
                  ['1','Alcoa Inc'],
                  ['2', 'Altria Group Inc'],
                  ['3','American Express Company'],
                  ['4','American International Group, Inc.'],
                  ['5','AT&T Inc.']
                ];
        var store = new Ext.data.SimpleStore({
            fields: [
              {name: 'code'},
              {name: 'name'}
            ]
        });
        store.loadData(this.myData);
        
        config = Rs.apply(config || {}, {
            store : store,
            columns: [
                      {id:'code',header: "Code", sortable: true, dataIndex: 'code'},
                      {header: "Name", sortable: true, dataIndex: 'name'}
                    ],
                    
            viewConfig : { forceFit : true}
        });

        rs.app.query.GridPanel.superclass.constructor.call(this, config);
        Rs.EventBus.on('querypanel-query', this.onQuery, this);
        Rs.EventBus.on('querypanel-reset', this.onReset, this);
    },
    
    onQuery : function(qpanel, params){
        var store = this.getStore();
        var addtoresult = true;
        var result = [];
        store.each(function(r){
            for(var p in params){
                if(r.get(p)!= params[p]){
                    addtoresult = false;
                    break;
                }
            }
            if(addtoresult){
                result.push(r);
            }
        },this);
        store.removeAll();
        store.insert(0,result);
    },
    
    onReset : function(){
        var store = this.getStore();
        store.removeAll();
        store.loadData(this.myData);
    }
});