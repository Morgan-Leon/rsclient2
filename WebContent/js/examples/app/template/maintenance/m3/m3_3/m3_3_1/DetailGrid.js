Rs.define('rs.app.template.maintenance.DetailGrid', {
    
    extend : Ext.grid.EditorGridPanel,
    
    mixins : [Rs.app.Main], 
    
    constructor : function(config){
        var store = new Rs.ext.data.Store({
            url : '/rsc/js/examples/app/template/maintenance/m3/detailservice.rsc',
            fields: ['item_code', 'item_name',
                     'order_no','order_seq_no','receive_qty','manufacturer_code',
                     'receive_price', 'receive_no','seq_no']
            });
        var sm = new Ext.grid.CheckboxSelectionModel({});
        config = Rs.apply(config || {}, {
            height : 400,
            width : 720,
            sm : sm,
            store : store,
            columns : [sm, new Ext.grid.RowNumberer({header : '行号', width:40}),{
                id:'item_code',
                header : '物料编码',
                dataIndex : 'item_code',
                editor : new Ext.form.TextField({})
            },{
                id:'item_name',
                header : '物料名称',
                dataIndex : 'item_name',
                editor : new Ext.form.TextField({})
            },{
                id:'order_no',
                header : '订单号',
                dataIndex : 'order_number',
                editor : new Ext.form.TextField({})
            },{
                id:'order_seq_no',
                header : '订单行号',
                dataIndex : 'order_seq_no',
                editor : new Ext.form.NumberField({}),
                renderer : function(value){
                    if(value === 'undefined'){
                        return '';
                    } else{
                        return value;
                    }
                }
            },{
                id:'receive_qty',
                header : '*数量',
                dataIndex : 'receive_qty',
                editor : new Ext.form.NumberField({}),
                summaryType: 'sum'//,
                //summaryRenderer: this.getTotalCount
            },{
                id:'manufacturer_code',
                header : '*公司编码',
                dataIndex : 'manufacturer_code',
                editor : new Ext.form.TextField({})
            },{
                id:'receive_price',
                header : '*单价',
                dataIndex : 'receive_price',
                editor : new Ext.form.NumberField({}),
                renderer : function(value){
                    if(value === 'undefined'){
                        return '';
                    } else{
                        return value;
                    }
                }
                //summaryType: 'average', 
                //summaryRenderer: this.getTotalPrice
            }],
            plugins : [new Rs.ext.grid.GridPageSummary({addline : 1})]
        });

        rs.app.template.maintenance.DetailGrid.superclass.constructor.call(this, config);
        this.on('afteredit', this.insertAddLine, this);
        Rs.EventBus.on('documenthead-save', this.doSave, this);
    },
    
    onRender : function(){
        rs.app.template.maintenance.DetailGrid.superclass.onRender.apply(this, arguments);
        //this.insertAddLine();
    },
    
    insertAddLine : function(){
        var store =  this.getStore();
        var record = store.getAt(store.getCount()-1);
        var flag = false;
        for(var p in record.data){
            if(record.data[p].length>0){
                flag = true;
            }
        }
        flag && store && store.insert(store.getCount(), new store.recordType({'item_code':'', 'item_name':'',
            'order_no':'','order_seq_no':'','receive_qty':'','manufacturer_code':'',
            'receive_price':'','receive_no':'', 'seq_no':''}));
    },
    
    getTotalPrice : function(v){
        return v? ( (v * this.count).toFixed(2)) : '';
    },
    
    getTotalCount : function(v){
        this.count = v;
        return '';
    },
    
    setData : function(rn){
        var store = this.getStore();
       /* store.baseParams = {
            receive_no : rn//,
            //callback : this.a
        };*/
        store.reload({
            params : {
                receive_no : rn
            }
        });
        //this.insertAddLine();
    },
    
    resetData : function(){
        this.getStore().load();
        //this.insertAddLine();
    },
    
    doSave : function(rn){
        alert(rn);
    }
});