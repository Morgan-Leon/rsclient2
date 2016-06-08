Rs.define(
    /**
     * @class InfoArea
     * @extends Ext.grid.EditorGridPanel 
     * <p>树孩子节点信息展示面板</p>
     * @constructor
     * @param {Object} config
     */
    'rs.app.template.maintenance.InfoArea', {
        
        extend : Ext.grid.EditorGridPanel,
        
        mixins : [Rs.app.Main],
        
        constructor : function(config){
        
        var store = new Rs.ext.data.Store( {
            autoLoad : false,
            autoDestroy : true,
            url : '/rsc/js/examples/app/dimDefPage/infoArea/dataservice.rsc',
            sortField : 'identifier',
            fields : [ 'identifier', 'dim_desc', 'attribute_1', 'attribute_2', 'attribute_3', 'attribute_4', 'attribute_5', 'id', 'path']
        });
        
        store.on("save", function(){
            this.fireEvent("change", this);
        },this);
        
        var sm = new Ext.grid.CheckboxSelectionModel({});
        
        config = Rs.apply(config || {}, {
            store : store,
            sm : sm,
            columns : [ sm, {
                header : '成员标识',
                width : 100,
                sortable : true,
                editable : false,
                dataIndex : 'identifier'
            }, {
                header : '成员描述',
                width : 100,
                sortable : true,
                dataIndex : 'dim_desc',
                editor   : new Ext.form.TextField({})
            }, {
                header : '年度',
                width : 200,
                sortable : true,
                dataIndex : 'attribute_1',
                editor   : new Ext.form.TextField({})
            }, {
                header : '半年',
                width : 100,
                sortable : false,
                dataIndex : 'attribute_2',
                editor   : new Ext.form.TextField({})
            },{
                header : '季度',
                width : 100,
                sortable : false,
                dataIndex : 'attribute_3',
                editor   : new Ext.form.TextField({})
            }, {
                header : '月',
                width : 100,
                sortable : false,
                dataIndex : 'attribute_4',
                editor   : new Ext.form.TextField({})
            }, {
                header : '天',
                width : 100,
                sortable : false,
                dataIndex : 'attribute_5',
                editor   : new Ext.form.TextField({})
            }],
            tbar : [{
                text : '保存',
                iconCls : "rs-action-save",
                handler : function(){
                    if(store.removed.length>0 || store.getModifiedRecords().length>0){
                        store.save();
                    }
                },
                scope : this
            }, {
                text : '删除',
                iconCls : "rs-action-remove",
                handler : function(){
                    if(this.getSelectionModel().getSelections().length==0){
                        alert("请选择要删除的数据");
                        return;
                    }
                    this.fireEvent("change","remove",this.getSelectionModel().getSelections());
                    store.remove(this.getSelectionModel().getSelections());
                    store.save();
                },
                scope : this
            }],
            bbar : new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 20,
                hasSlider : true,
                store : store,
                displayInfo : false
            })
        });

        rs.app.template.maintenance.InfoArea.superclass.constructor.call(this, config);
        this.addEvents([
            /**
             * @event change
             * 表格内容变化时触发.
             * @param {String} action 引起变化的动作
             * @param {Object} r 变化内容
             */
             "change",
             /**
              * @event add
              * 点击添加按钮时触发.
              * @param {Ext.tree.TreeNode} activenode 当前活动树节点
              */
             "add"]);
        Rs.EventBus.register(this, 'info', ['change']);
        Rs.EventBus.register(this, 'info', ['add']);

        Rs.EventBus.on('tree-click', this.onTreeClick, this);
        Rs.EventBus.on('tree-generatedim', this.store.removeAll, this.store);
        Rs.EventBus.on('addwindow-adddim', this.onAddDim, this);
    },
    onTreeClick : function(n, e) {
            var a = n ? n.attributes : {},
                dimId = a.dimId, 
                level = a.level;
            this.activeNode = a;
            this.getStore().reload( {
                params : {
                    dimId : dimId,
                    level : level
                }
            });
        },
        
        onAddDim:function(){
            this.ostorer = [];
            this.store.each(function(rec){
                this.ostorer.push(rec);
            },this);
            this.store.reload();
            this.store.on("load",this.onStoreChange,this);

            //this.fireEvent("change", this);
        },
        
        onStoreChange : function(s, rs){
            var lr;
            if(rs.length-this.ostorer.length==1){
                //lr= rs[rs.length-1];
                for(var i = 0 ; i < rs.length; i++){
                    for(var j = 0 ; j < this.ostorer.length; j++){
                        if(rs[i].get("id")==this.ostorer[j].get("id")){
                            break;
                        }
                        if(j==this.ostorer.length-1 && rs[i].get("id")!=this.ostorer[j].get("id")){
                            this.fireEvent("change", 'add',rs[i].data);
                        }
                    }
                }
            }
            this.store.un("load",this.onStoreChange,this);
        }
    
});