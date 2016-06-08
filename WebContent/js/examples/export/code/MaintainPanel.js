Rs.define('rs.app.template.maintenance.MaintainPanel', {

    extend : Ext.grid.GridPanel,

    mixins : [ Rs.app.Main ],
    
    constructor : function(config) {
    
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            //idProperty: 'receive_no',
            url: '/rsc/js/examples/export/dataservice.rsc',
            fields: ['RS_ID','WAREHOUSE_CODE','WAREHOUSE_NAME','BILL_NO','BILL_DATE',
            'ACTIVE_CODE','ACTIVE_ABV','IO_FLAG','OTHER_FLAG','OM_ORDER','PM_ORDER',
            'SHOP_ORDER','DEPT_CODE','DEPT_ABV','VENDOR_CODE','VENDOR_ABV','CUSTOMER_CODE','CUSTOMER_ABV',
            'WAREHOUSE_MAN','WAREHOUSE_MAN_CODE','WAREHOUSE_MAN_NAME','USE_CODE','USE_DESC',
            'OPERATOR','OPERATOR_CODE','OPERATOR_NAME','OPERATOR_DEPT','OPERATOR_DEPT_NAME',
            'CHECK_FLAG','CHECK_DATE','CHECK_MAN','CHECK_MAN_NAME','QC_NO','POST_MAN','POST_MAN_NAME',
            'POST_DATE','RECORD_MAN','RECORD_MAN_NAME','RECORD_DATE','RECORD_TIME','REMARK','COMPANY_NO',
            'VOUCHER_PERIOD','VOUCHER_DATE','VOUCHER_FLAG','VOUCHER_NO','VOUCHER_ON_TIME','VOUCHER_TYPE']
        });
       
        var sm = new Ext.grid.CheckboxSelectionModel({});
        config = Rs.apply(config || {}, {
            store : store,
            //columnLines:true,
            sm : sm,
            columns : [ sm,
                        {
                            xtype : 'actioncolumn',
                            header : '操作',
                            width : 50,
                            align : 'center',
                            items : [
                                {
                                    iconCls : 'rs-action-modify',
                                    handler: this.openModifyPanel,
                                    scope : this
                                }
                            ]
                        },
                        {dataIndex:'RS_ID',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'WAREHOUSE_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       
                       {dataIndex:'WAREHOUSE_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       
                       {dataIndex:'BILL_NO',header: "接收单号", 
                            align : 'BILL_DATE',width: 160, sortable: true},
                       
                       {dataIndex:'ACTIVE_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'ACTIVE_ABV',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'IO_FLAG',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OTHER_FLAG',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OM_ORDER',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'PM_ORDER',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'SHOP_ORDER',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'DEPT_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'DEPT_ABV',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'VENDOR_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'VENDOR_ABV',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'CUSTOMER_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'CUSTOMER_ABV',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'WAREHOUSE_MAN',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'WAREHOUSE_MAN_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'WAREHOUSE_MAN_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'USE_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'USE_DESC',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OPERATOR',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OPERATOR_CODE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OPERATOR_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OPERATOR_DEPT',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'OPERATOR_DEPT_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'CHECK_FLAG',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'CHECK_DATE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'CHECK_MAN',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'CHECK_MAN_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'QC_NO',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'POST_MAN',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'POST_MAN_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'POST_DATE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'RECORD_MAN',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'RECORD_MAN_NAME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'RECORD_DATE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'RECORD_TIME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'REMARK',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                        
                       {dataIndex:'COMPANY_NO',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'VOUCHER_PERIOD',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'VOUCHER_DATE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'VOUCHER_FLAG',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'VOUCHER_NO',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                        
                       {dataIndex:'VOUCHER_ON_TIME',header: "接收单号", 
                            align : 'left',width: 160, sortable: true},
                       
                       {dataIndex:'VOUCHER_TYPE',header: "接收单号", 
                            align : 'left',width: 160, sortable: true}
                      ],

            tbar : [ new Rs.ext.grid.ExportButton({
                grid : this,
                filename : "文件"})
            ],
            bbar : new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 30,
                hasSlider : true,
                store : store,
                displayInfo : true,
                displayMsg: '共{2}条'
            })
            //viewConfig : {forceFit : true}
        });
        

        rs.app.template.maintenance.MaintainPanel.superclass.constructor.call(this, config);
        
        this.addEvents('modify','add');

        Rs.EventBus.on('popquerypanel-query', this.doQuery, this);
        Rs.EventBus.register(this, 'maintainpanel', ['modify']);
        Rs.EventBus.register(this, 'maintainpanel', ['add']);

    },
    
    doQuery : function(qp, params){
            this.getStore().reload({params : params});
            /*var data = this.store.queryBy(function(record, id){
                for(var p in params){
                    if(p == 'receive_date1'){
                        if(params[p] < record.get(p)){
                            return false;
                        }
                    } else if(p == 'receive_date2'){
                        if(params[p] > record.get(p)){
                            return false;
                        }
                    } else{
                        if(params[p]!= record.get(p)){
                            return false;
                        } 
                    } 
                }
                return true;
            },this);
            this.store.loadData({total : data.items.length, data : data.items, success:true}, true);*/
    },
    
    openQueryPanel : function(){
        var engine = Rs.getAppEngine();
        var csize = this.getSize();
        var cpos = this.getPosition();
        var width = 530;
        var height = 200; 
        engine.install( {
            folder : 'm3_1',
            region : {
                x : cpos[0]+(csize.width-width)/2,
                y : cpos[1]+(csize.height-height)/2,
                width : width,
                height : height,
                maximizable : false,
                minimizable : false,
                resizable : true,
                hidden : true
            }
        }, function(succ, app) {
            if (succ && app) {
                app.open();
            }
        }, this);
    },
    
    openAddPanel : function(){
        var engine = Rs.getAppEngine();
        var csize = this.getSize();
        var cpos = this.getPosition();
        var width = 820;
        var height = 400; 
        engine.install( {
            folder : 'm3_3/m3_3_1',
            region : {
                x : cpos[0]+(csize.width-width)/2,
                y : cpos[1]+(csize.height-height)/2,
                width : width,
                height : height,
                maximizable : false,
                minimizable : false,
                resizable : false,
                hidden : true,
                modal : true
            }
        }, function(succ, app) {
            if (succ && app) {
                app.open();
                this.fireEvent('add');
            }
        }, this);
    },

    openModifyPanel : function(grid, rowIndex, colIndex) {
        var rec = this.store.getAt(rowIndex);
        var engine = Rs.getAppEngine();
        var csize = this.getSize();
        var cpos = this.getPosition();
        var width = 820;
        var height = 400; 
        engine.install( {
            folder : 'm3_3/m3_3_1',
            region : {
                x : cpos[0]+(csize.width-width)/2,
                y : cpos[1]+(csize.height-height)/2,
                width : width,
                height : height,
                maximizable : false,
                minimizable : false,
                resizable : false,
                hidden : true,
                modal : true
            }
        }, function(succ, app) {
            if (succ && app) {
                app.open();
                this.fireEvent('modify', rec);
            }
        }, this);
    },
    
    deleteRecord : function(){
        var selects = this.getSelectionModel().getSelections();
        if(!selects || selects.length<1){
            Ext.Msg.alert("提示","请选择要删除的数据行");
            return;
        }
        Ext.Msg.show({
            title:'提示',
            msg: '确定要删除选中的记录吗?',
            buttons: Ext.Msg.OKCANCEL,
            fn: function(b){
                if(b=='cancel'){
                    return;
                }
                this.store.remove(selects);
                this.store.save();
            },
            animEl: 'elId',
            scope : this,
            icon: Ext.MessageBox.QUESTION
         });
    }
});
