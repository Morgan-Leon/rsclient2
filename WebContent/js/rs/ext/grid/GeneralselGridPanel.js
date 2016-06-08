Ext.ns("Rs.ext.grid");

(function(){
    
    /**
     * @class Rs.ext.grid.GeneralselGridPanel ��Զ�����
     * ����ʵ��ͨ����Զ������Ͳ�ѯ��������ȡ���ݵı����ʾ��������Ϊ��Զ�������ж�����С�
     * Ҳ����ͨ��columns ��cm ������Ҫ��ʾ���С�
     * <pre><code>
    var grid = new Rs.ext.grid.GeneralselGridPanel( {
        title : '������ϸ���1',
        height : 350,
        width : 400,
        progCode : 'ordDetail',
        progCondition : ' a.company_code = \'00\' and rownum < 20 ',
        sm : new Ext.grid.CheckboxSelectionModel()     //����selection model
    });
    grid.render('grid-div1');
    
    //store ��grid
    var store8 = new Rs.ext.data.GeneralselStore({
        autoLoad : true,
        autoDestroy : true,
        progCode : 'invVendor',
        progCondition : ' company_code = \'00\' '
    });
    
    var grid8 = new Rs.ext.grid.GeneralselGridPanel({
        title : '���',
        height : 350,
        width : 400,
        store : store8,
        //ָ��Ҫ��ʾ���У������ָ�����򽫻������Զ�������������ʾ����
        columns : [{
            dataIndex : 'VENDOR_NAME',
            header : '��Ӧ������',
            width : 200,
            sortable : true
        }, {
            dataIndex : 'VENDOR_CODE',
            header : '��Ӧ�̱���',
            width : 150,
            sortable : true
        }],
        bbar: new Rs.ext.grid.SliderPagingToolbar({
            pageSize : 10,
            hasSlider : true,
            store : store8,
            displayInfo : false
        })
    });
    grid8.render("grid-div8");
     * </code></pre>
     * @extends Ext.grid.GridPanel
     */
    Rs.ext.grid.GeneralselGridPanel = function(config){
        config = config  || {};
        var progCode = config.progCode,
            progCondition = config.progCondition,
            dataCompany = config.dataCompany;
        var store = config.store || config.ds || new Rs.ext.data.GeneralselStore({
            autoLoad : true,
            autoDestroy: true,
            progCode : progCode,
            progCondition : progCondition,
            dataCompany: dataCompany
        });
        var columns = config.columns || [];
		this.configColumns =  columns ;
        delete config.columns;
        Ext.applyIf(config, {
            store : store,
            columns : columns
        });
        Rs.ext.grid.GeneralselGridPanel.superclass.constructor.call(this, config);
        
        //�� store ��Ԫ���ݷ����仯��ʱ���޸ı���colModel
        this.store.on('metachange', this.onStoreMeataChange, this);
    };
    
    Ext.extend(Rs.ext.grid.GeneralselGridPanel, Ext.grid.GridPanel, {
        
        /**
         * @cfg {String} progCode ��Զ������
         */
        
        /**
         * @cfg {String} progCondition ��Զ������
         */
    	
        /**
         * @cfg {String} dataCompany dblink��˾��
         */
        
        //private
        onStoreMeataChange : function(store, meta){
            var columns = [], fields = [], i, l, field ;
            if(fields = meta ? meta.fields : undefined){
                if(this.selModel != undefined
                    && this.selModel instanceof Ext.grid.CheckboxSelectionModel){
                    columns.push(this.selModel);
                    if(this.rendered == true){
                        this.getSelectionModel().init(this);
                    }
                }
                if(this.configColumns.length == 0){
                    for(i = 0, l = fields.length; i < l; i++){
                        for(var k in fields){
                            var f = fields[k] ;
                            if(f['seqNo'] == i){
                                field = f ;
                                break ;
                            }
                        }
                        var c = {
                            dataIndex : field.name,
                            header : field.descCh || field.descEn || field.name,
                            width : field.width,
                            align : field.align,
                            hidden : field.hidden,
                            editable : false,
                            hideable : true,
                            sortable : true
                        } ;
                        columns.push(c);
                    }
                } else {
                    columns = Ext.combine(columns,this.configColumns) ;
                }
                var colModel = new Ext.grid.ColumnModel(columns);
                this.reconfigure(store, colModel);
            }
        }
    });
    
    Ext.ComponentMgr.registerType("rs-ext-generalselgridpanel", Rs.ext.grid.GeneralselGridPanel);
})();