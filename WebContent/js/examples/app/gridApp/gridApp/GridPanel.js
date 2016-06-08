Rs.define('rs.grid.GridPanel', {
   
    extend : Ext.grid.EditorGridPanel,
    
    mixins : [Rs.app.Main],
    
    constructor : function(config){
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            url: '/rsc/js/examples/app/gridApp/gridApp/dataservice.rsc',
            root: 'items',
            idProperty: 'code',
            sortField : 'code',
            fields: ['COMPANY_CODE','ORG_ID','code', 'name', {name:'price', type: 'float'},
                     'ITEM_ABV', 
                     'GB_CODE',
                     'DRAWING_NO',
                     'REFER_CODE',
                     'MEMORY_CODE',
                     'NORMAL_CLASS',
                     'PM_FLAG',
                     'OM_FLAG',
                     'INV_FLAG',
                     'QC_FLAG',
                     'SPECIAL_CLASS',
                     'LOT_FLAG',
                     'STOCK_UNIT',
                     'BI_UNIT_FLAG',
                     'SECOND_UNIT',
                     'ASSIST_UNIT',
                     'PM_UNIT',
                     'OM_UNIT',
                     {name:'PM_STOCK_RATE',type:'float'},
                     {name:'OM_STOCK_RATE',type:'float'},
                     {name:'STOCK2_RATE',type:'float'},
                     'UNIQUE_FLAG',
                     {name:'TOLERANCE',type:'float'},
                     'PRICE_SYS',
                     'ABC_CLASS',
                     {name:'ON_HAND_QTY',type:'float'},
                     {name:'ON_HAND_AMT',type:'float'},
                     'COST_FLAG',
                     {name:'NET_WEIGHT',type:'float'},
                     'NET_UNIT',
                     'BYPRODUCT_FLAG',
                     'MRP_FLAG',
                     'LOT_POLICY',
                     {name:'LOT_QTY',type:'float'},
                     {name:'ROUND_TIMES',type:'float'}
            ],
            baseParams : {
                pm_flag : 'Y'
            }
        });
        config = Rs.apply(config || {}, {
            store : store,
            columns : [
                {
                    header   : 'COMPANY_CODE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'COMPANY_CODE'
                },
                {
                    header   : 'ORG_ID', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ORG_ID'
                },
                {
                    id       :'code',
                    header   : '物料编码', 
                    width    : 100, 
                    sortable : true, 
                    dataIndex: 'code',
                    editor : new Ext.form.TextField({})
                },
                {
                    header   : '物料名称', 
                    width    : 100, 
                    sortable : true, 
                    dataIndex: 'name',
                    editor : new Ext.form.TextField({})
                },
                {
                    header   : '计划价', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'price',
                    editor : new Ext.form.TextField({})
                },
                {
                    header   : 'ITEM_ABV', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ITEM_ABV'
                },
                {
                    header   : 'GB_CODE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'GB_CODE'
                },
                {
                    header   : 'DRAWING_NO', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'DRAWING_NO'
                },
                {
                    header   : 'REFER_CODE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'REFER_CODE'
                },
                {
                    header   : 'MEMORY_CODE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'MEMORY_CODE'
                },
                {
                    header   : 'NORMAL_CLASS', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'NORMAL_CLASS'
                },
                {
                    header   : 'PM_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'PM_FLAG'
                },
                {
                    header   : 'OM_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'OM_FLAG'
                },
                {
                    header   : 'INV_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'INV_FLAG'
                },
                {
                    header   : 'QC_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'QC_FLAG'
                },
                {
                    header   : 'SPECIAL_CLASS', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'SPECIAL_CLASS'
                },
                {
                    header   : 'LOT_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'LOT_FLAG'
                },
                {
                    header   : 'STOCK_UNIT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'STOCK_UNIT'
                },
                {
                    header   : 'BI_UNIT_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'BI_UNIT_FLAG'
                },
                {
                    header   : 'SECOND_UNIT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'SECOND_UNIT'
                },
                {
                    header   : 'ASSIST_UNIT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ASSIST_UNIT'
                },
                {
                    header   : 'PM_UNIT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'PM_UNIT'
                },
                {
                    header   : 'OM_UNIT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'OM_UNIT'
                },
                {
                    header   : 'PM_STOCK_RATE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'PM_STOCK_RATE'
                },
                {
                    header   : 'OM_STOCK_RATE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'OM_STOCK_RATE'
                },
                {
                    header   : 'STOCK2_RATE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'STOCK2_RATE'
                },
                {
                    header   : 'UNIQUE_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'UNIQUE_FLAG'
                },
                {
                    header   : 'TOLERANCE', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'TOLERANCE'
                },
                {
                    header   : 'PRICE_SYS', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'PRICE_SYS'
                },
                {
                    header   : 'ABC_CLASS', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ABC_CLASS'
                },
                {
                    header   : 'ON_HAND_QTY', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ON_HAND_QTY'
                },
                {
                    header   : 'ON_HAND_AMT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ON_HAND_AMT'
                },
                {
                    header   : 'COST_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'COST_FLAG'
                },
                {
                    header   : 'NET_WEIGHT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'NET_WEIGHT'
                },
                {
                    header   : 'NET_UNIT', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'NET_UNIT'
                },
                {
                    header   : 'BYPRODUCT_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'BYPRODUCT_FLAG'
                },
                {
                    header   : 'BYPRODUCT_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'BYPRODUCT_FLAG'
                },
                {
                    header   : 'MRP_FLAG', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'MRP_FLAG'
                },
                {
                    header   : 'LOT_POLICY', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'LOT_POLICY'
                },
                {
                    header   : 'LOT_QTY', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'LOT_QTY'
                },
                {
                    header   : 'ROUND_TIMES', 
                    width    : 100,
                    sortable : true, 
                    dataIndex: 'ROUND_TIMES'
                }
            ],
            tbar : [{
                text : '汇总',
                scope : this,
                handler : function(){
                    Rs.Service.call({
                        url: '/rsc/js/examples/app/gridApp/gridApp/dataservice2.rsc',
                        method : 'gather',
                        params : { 
                            id : 101
                        }
                    }, function(result){
                        
                    }, this);
                }
            }, {
                text : '保存',
                scope : this,
                handler : function(){
                    var store = this.getStore();
                    store.save();
                }
            }],
            bbar: new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : store,
                displayInfo : false
            })
        });
        rs.grid.GridPanel.superclass.constructor.call(this, config);
    }
    
});