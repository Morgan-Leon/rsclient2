Rs.define('rs.app.template.maintenance.GridWithAddLinePanel', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
    
        var myData = [
                  ['3m Co',71.72,0.02],
                  ['Alcoa Inc',29.01,0.42],
                  ['Altria Group Inc',83.81,0.28],
                  ['American Express Company',52.55,0.01],
                  ['American International Group, Inc.',64.13,0.31],
                  ['AT&T Inc.',31.61,-0.48],
                  ['Boeing Co.',75.43,0.53],
                  ['Caterpillar Inc.',67.27,0.92],
                  ['Citigroup, Inc.',49.37,0.02],
                  ['E.I. du Pont de Nemours and Company',40.48,0.51],
                  ['Exxon Mobil Corp',68.1,-0.43]
                ];

        var store = new Ext.data.SimpleStore({
          fields: [
            {name: 'company'},
            {name: 'price', type: 'float'},
            {name: 'change', type: 'float'}
          ]
        });
        store.loadData(myData);
        
        config = Rs.apply(config || {}, {
            store : store,
            columns : [ new Ext.grid.RowNumberer(),
                        {id:'company',header: "公司", width: 160, sortable: true, dataIndex: 'company', editor : new Ext.form.TextField({})},
                        {header: "报价", width: 75, sortable: true, dataIndex: 'price',editor: new Ext.form.NumberField({allowDecimals: true})},
                        {header: "增长率", width: 100, sortable: true, dataIndex: 'change',editor: new Ext.form.NumberField({allowDecimals: true})}
                      ],
                      tbar : [{
                          text : '保存',
                          iconCls : "rs-action-save",
                          scope : this
                          }],
            viewConfig : {forceFit : true}
        });
        

        rs.app.template.maintenance.GridWithAddLinePanel.superclass.constructor.call(this, config);

        //Rs.EventBus.on('tree-click', this.onTreeClick, this);

        Rs.EventBus.on('addlinepanel-addnew', function(nr) {
            for(var i = 0; i < nr.length; i++){
                if(nr[i].get('company')){
                    this.store.insert(this.store.getCount(), nr[i]);
                }
            }
        }, this);

    },

    onTreeClick : function(n, e) {
        var a = n ? n.attributes : {}, code = a.code, type = a.type;
        this.panentAcct = a;
        this.getStore().reload( {
            params : {
                code : code,
                type : type
            }
        });
    },

    openCreateAcctPanel : function() {
            var engine = Rs.getAppEngine();
            engine.install( {
                folder : 'm3/m3_1',
                region : {
                    x : 550,
                    y : 50,
                    width : 330,
                    height : 200,
                    maximizable : false,
                    minimizable : false,
                    resizable : false,
                    hidden : true
                }
            }, function(succ, app) {
                if (succ && app) {
                    app.open();
                }
            }, this);
    },

    save : function() {
        alert('save');
    }

});
