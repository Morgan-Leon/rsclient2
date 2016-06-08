Rs.define('rs.app.template.maintenance.MaintainPanel', {

    extend : Ext.grid.GridPanel,

    mixins : [ Rs.app.Main ],

    constructor : function(config) {
    
        var store = new Rs.ext.data.Store({
            autoLoad : true,
            autoDestroy: true,
            idProperty: 'receive_no',
            url: '/rsc/js/examples/app/template/maintenance/m3/dataservice.rsc',
            fields: ['receive_no', 'vendor_abv', 'receive_date',
                     'type_desc','buyer_name','receive_amt','group_id', 'vendor_code', 
                     'special_class', 'buyer_id', 'deliver_code', 'bill_type']
        });
       
        var sm = new Ext.grid.CheckboxSelectionModel({});
        config = Rs.apply(config || {}, {
            store : store,
            //columnLines:true,
            sm : sm,
            columns : [ sm,
                        {
                            xtype : 'actioncolumn',
                            header : '����',
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
                        {dataIndex:'receive_no',header: "���յ���", 
                            align : 'left',width: 160, sortable: true},
                        {dataIndex:'vendor_abv',header: "��Ӧ��", 
                            align : 'left',width: 160, sortable: true},
                        {dataIndex:'receive_date',header: "��������", 
                            align : 'center',width: 75, sortable: true},
                        {dataIndex:'type_desc',header: "��������", 
                            align : 'left',width: 100, sortable: true},
                        {dataIndex:'buyer_name',header: "�ɹ�Ա", 
                            align : 'left',width: 100, sortable: true},
                        {dataIndex:'receive_amt',header: "�����ܽ��", 
                            align : 'right',width: 100, sortable: true, renderer : function(value){
                                
                                if(value === 'undefined'){
                                    return '';
                                } else{
                                    return value;
                                }
                            }
                        }
                      ],

            tbar : [ {
                text : '��ѯ���',
                iconCls : 'rs-action-querypanel',
                scope : this,
                handler : this.openQueryPanel
            }, {
                text : '����',
                iconCls : 'rs-action-create',
                handler : this.openAddPanel,
                scope : this
            }, {
                text : 'ɾ��',
                iconCls : 'rs-action-remove',
                scope : this,
                handler : this.deleteRecord
            },new Rs.ext.grid.ExportButton({
				grid : this,
				filename : "�ļ�"
			})
			,'->',{
                text : '����',
                iconCls : 'rs-action-help'
            }],
            bbar : new Rs.ext.grid.SliderPagingToolbar({
                pageSize : 30,
                hasSlider : true,
                store : store,
                displayInfo : true,
                displayMsg: '��{2}��'
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
            Ext.Msg.alert("��ʾ","��ѡ��Ҫɾ����������");
            return;
        }
        Ext.Msg.show({
            title:'��ʾ',
            msg: 'ȷ��Ҫɾ��ѡ�еļ�¼��?',
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
