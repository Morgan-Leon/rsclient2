Rs.define('rs.demo.grid.EditorGrid', {

    extend : Ext.grid.EditorGridPanel,

    mixins : [Rs.app.Main],
    
    constructor : function(config) {
    	
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy : true,
            readUrl : '/rsc/js/examples/app/demo/grid/editorGrid/readService.rsc',
            readMethod : 'readItems',
            updateUrl : '/rsc/js/examples/app/demo/grid/editorGrid/updateService.rsc',
            updateMethod : 'updateItems',
            createUrl : '/rsc/js/examples/app/demo/grid/editorGrid/createService.rsc',
            createMethod : 'createItems',
            destroyUrl : '/rsc/js/examples/app/demo/grid/editorGrid/destroyService.rsc',
            destroyMethod : 'destroyItems',
            root : 'items',
            idProperty : 'code',
            sortField : 'code',
            fields : [ 'code', 'name', {
                name : 'price',
                type : 'float'
            } ],
            baseParams : {
                pm_flag : 'Y'
            }
        });
        
        Rs.apply(store.baseParams.metaData, {
            limit : 20
        });

        var sm = new Ext.grid.CheckboxSelectionModel( {});

        config = Rs.apply(config || {}, {
            store : store,
            sm : sm,
            columns : [ sm, {
                id : 'code',
                header : '物料编码',
                width : 100,
                sortable : true,
                dataIndex : 'code'
            }, {
                header : '物料名称',
                width : 100,
                sortable : true,
                dataIndex : 'name',
                editor : new Ext.form.Field(
                        {})
            }, {
                header : '计划价',
                width : 75,
                sortable : true,
                dataIndex : 'price',
                editor : new Ext.form.Field(
                        {})
            } ],
            tbar : [{
                text : '新增',
                scope : this,
                handler : function() {
                    var i = store.getCount() + 1;
                    var data = {
                        code : 'ITEM-CODE-' + i,
                        name : 'ITEM-NAME-' + i,
                        price : 10 + i
                    };
                    this.stopEditing();
                    this.store.insert(0, new store.recordType(data));
                    this.startEditing(0, 0);
                }
            }, {
                text : '删除所有',
                handler : function() {
                    this.store.removeAll();
                },
                scope : this
            }, {
                text : '删除',
                handler : function() {
                    this.store.remove(this.getSelectionModel().getSelections());
                },
                scope : this
            }, {
                text : '保存',
                handler : function() {
                    this.store.save();
                },
                scope : this
            }]
        });
        rs.demo.grid.EditorGrid.superclass.constructor.call(this, config);
    }

});