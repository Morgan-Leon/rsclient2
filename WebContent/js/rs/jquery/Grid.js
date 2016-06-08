Rs.ns("Rs.jquery.Grid");

(function(){
	
	/**
	 * @class Rs.jquey.Grid
	 * @extend Rs.util.Observable
	 * �����Ƕ�jqGird�ķ�װ�����ֳ�jqGrid�ı��
	 */
	
	Rs.jquery.Grid = function(config) {
    
        Rs.apply(this, config);
        
        Rs.jquery.Grid.superclass.constructor.call(this);
        
        this.addEvents(
        	/**
                 * 
                 * @event beforerender
                 * @param none
                 * @return {Boolean} boolean
                 */
        		'beforerender',
				/**
                 * 
                 * @event render
                 * @param none
                 * @return {Boolean} boolean
                 */
        		'render',
				/**
                 * 
                 * @event afterrender
                 * @param none
                 * @return {Boolean} boolean
                 */
        		'afterrender', 
				/**
                 * ������ÿ��ʱ����
                 * @event afterInsertRow
                 * @param {Nubmer} rowid ���뵱ǰ�е�id
                 * @param {String} rowdata �����е�����,��ʽΪname: value��nameΪcolModel�е����֡�rowelem�Ǵӷ��������ص�����
                 * @param {String} rowelem �ӷ��������ص�����,�������ʱxml�򷵻ظ��е�xml���ݣ������json���ͷ������й������е��������ݵ����顣
                 * @return {Boolean} boolean �������true�������ɣ��������false��ʧ��
                 */
        		'afterInsertRow',
				
                /**
                 * ���û������ǰ����δѡ�����ʱ������
                 * @event beforeSelectRow
                 * @param {Nubmer} rowid ����id
                 * @param {Event}e �¼�����
                 * @return {Boolean} boolean �������true��ѡ����ɣ��������false�򲻻�ѡ�����Ҳ���ᴥ�������¼�
                 */
                'beforeSelectRow',
				/**
                 * ���ӷ�����������Ӧʱִ��
                 * @event load
                 * @param {XMLHttpRequest} xhr XMLHttpRequest ����
                 * @return {Boolean} boolean
                 */
				'load',
				/**
                 * ������������ʧ������ô˷���
                 * @event loadError
                 * @param {XMLHttpRequest} xhr XMLHttpRequest ����
                 * @param {String} status ��������
                 * @param {Exception} error exception����
                 * @return {Boolean} boolean
                 */
				'loadError',
				/**
                 * �������Ԫ��ʱ������
                 * @event cellSelect
                 * @param {Nubmer} rowid ��ǰ��id
                 * @param {Nubmer} iCol ��ǰ��Ԫ������
                 * @param {String} cellcontent ��ǰ��Ԫ������
                 * @param {Event} e event����
                 * @return {Boolean} boolean
                 */
				'cellSelect',
                /**
                 * �������ʾ/���ر����Ǹ���ťʱ������
                 * @event headerClick
                 * @param {String} gridstate ���״̬����ѡֵ��visible or hidden
                 * @return {Boolean} boolean
                 */
                'headerClick', 
                /**
                 * �����ҳ��ť�������֮ǰ�������¼���ͬ��������ҳ����תҳ��ʱҲ�ᴥ�����¼�
                 * @event onPaging
                 * @param {Nubmer} pgButton ��ҳ�İ�ť
                 * @return {Boolean} boolean
                 */
                'onPaging', 
				/**
                 * �һ���ʱ������
                 * @event rightClickRow
                 * @param {Nubmer} rowid  ��ǰ��id
                 * @param {Number} iRow   ��ǰ������λ��
                 * @param {Nubmer} iCol   ��ǰ��Ԫ��λ������
                 * @parma {Event} e       event����
                 * @return {Boolean} boolean
                 */
				'rightClickRow',
				/**
                 * ˫����ʱ���� 
                 * @event rightClickRow
                 * @param {Nubmer} rowid ��ǰ��id
                 * @return {Boolean} boolean 
                 */
				'dblClickRow',
				/**
                 * ѡ����ʱ�������¼�
                 * @event selectRow
                 * @param {Nubmer} rowid ��ǰ��id
                 * @param {String} status ѡ��״̬����multiselect Ϊtrueʱ�˲����ſ���
                 * @return {Boolean} boolean
                 */
				'selectRow',
				/**
                 * ����������е������ݻ�δ���б仯ʱ�������¼���
                 * @event sortCol
                 * @param {Number} index name��colModel��λ������
                 * @param {Number} iCol ��ǰ��Ԫ��λ������
                 * @param {String} sortorder ����״̬��desc����asc
                 * @return {Boolean} boolean
                 */
				'sortCol',
                /**
                 * ����ʼ�ı�һ���п��ʱ�������¼�
                 * @event resizeStart
                 * @param {Event} event event����
                 * @param {Number} index ��ǰ����colModel��λ������
                 * @return {Boolean} boolean
                 */
				'resizeStart',
                /**
                 * ���п�ȸı�֮�󴥷����¼�
                 * @event resizeStop
                 * @param {Number} newwidth �иı��Ŀ��
                 * @param {Number} index ��ǰ����colModel�е�λ������
                 * @return {Boolean} boolean
                 */
				'resizeStop',
				/**
                 * applies only to cells that are not editable; fires after the cell is selected
                 * @event selectCell
                 * @param rowid ��ǰ��id
                 * @param celname ����
                 * @param value ֵ
                 * @param iRow ��ǰ������
                 * @param iCol ��ǰ������
                 * @return {Boolean} boolean
                 */
				'selectCell'	 
				
		);
            
        if(config && config.render){
            this.onRender(config.render);
        }
       
	};
    
	Rs.extend(Rs.jquery.Grid, Rs.util.Observable, {
        
        /**
         * ��ǰҳ��,Ĭ��ֵΪ0
         * @cfg {Nubmer} currentpage
         */
        currentpage : 0,
        
        /**
         * ���͵���̨��url
         * @cfg {String} url
         */
        
        /**
         * ��̨jsp����Ӧ�ķ�������
         * @cfg {String} method 
         */
        method  : 'read', 
        
        /**
         * columnModes  
         * @cfg {Array} cm
         */
        
        /**
         * ����Ƿ������   true�� �ǣ� false����
         * @cfg {Boolean} hidegrid
         */
        hidegrid : false ,
        
        /**
         * ��ʼ��grid�������  
         * @cfg {Number} limit
         */
         rowNum : 10 ,
         
         /**
         * ��ʼ��ʱ��һ�� �������� 
         * @cfg {String} sortField
         */        
         
         /**
          * ���������ݸ�ʽ���͵���̨ 
          * @cfg {String} datatype
          */     
         datatype : "json" ,
         
         /**
         * grid �߶�  
         * @cfg {Number} height
         */
         height : 350 , 
         
         /**
         * �������ã������ջ�ӵ�url���洫�ݵ���̨  
         * @cfg {Json} baseParams
         */
         
          /**
         * ��ͷ�� 
         * @cfg {String} title
         */
         
         /**
          * ��һ���Ƿ��и�ѡ��,Ĭ��Ϊfalse 
          * @cfg {Boolean} multiselect
          */
         multiselect : false,
         
         /**
         * grid��ʾ�е����Ƽ�˳�� 
         * @cfg {Array} fields
         */
         
         /**
         * grid����ÿҳ���������������ֵ
         * @cfg {Array} rowList Ĭ�� {10,50,100}
         */
         rowList : [10 , 50 , 100] ,
         /**
         * grid��Ҫ�����div����#��ͷ
         * @cfg {String} pager
         */
         
        //private 
        onBeforeRender : function(){},
        
        /**
         *  ��grid render֮��ִ��
         * @method onRender
         * @param {String} el
         * @return {Rs.jquery.Grid} grid
         */
        onRender : function(el) {

            if(!this.rendered && this.fireEvent('beforerender') != false 
            	&& this.onBeforeRender(this) != false){
                
            var url = this.url,
                method = this.method,
                sortField = this.sortField,
                baseParams = this.baseParams,
                datatype = this.datatype,
                hidegrid = this.hidegrid,
                multiselect = this.multiselect,
                limit = this.limit,
                title = this.title,
                cm = this.cm,
                fields =  this.fields,
                rowList = this.rowList,
                pager = this.pager,
                height = this.height;	
                    
                //urlƴ�ӳ�ΪRs��̨����ʶ���url
                var newurl = url + "?Rs-method=" + method + "&Rs-dataType=" + datatype +"&Rs-accept=json";
                	
                
                //��������֮ǰ����request�������ݽ��иı��ΪRs��̨����ʶ������ݸ�ʽ   
                var serializeGridData = function(data) {
                        var params = {
                            'pm_flag' : 'Y',
                                   'metaData' : {		
                                       'paramNames' : {
                                           'start':'start',
                                           'limit':'limit',
                                           'sort':'sort',
                                           'dir':'dir'},
                                       "idProperty":"code",
                                       "root":"rows",
                                       "totalProperty":"records",
                                       "successProperty":"success",
                                       "messageProperty":"message",
                                       'start':(data['page'] - 1)*data['rows'],
                                       'limit':data['rows'],
                                       'sortInfo':{'sort':data['sidx'],'dir':data['sord']}
                                   },
                            'xaction':'read'       
                        };
                        this.currentpage = data['page'];
                        var p = "params=" + Rs.encode(params);
                        return p;       
                    },
                 	//��response��̨�õ������ݽ��и�ʽ�������jqGrid�������ʾ�����ݵĸ�ʽ
                 	beforeProcessing = function(data, st, xhr) {
                        var rows = data["rows"].length;
                        var totalPage = Math.ceil(data["records"]/rows) ;
                                        
                        var records = new Array();
                            for(var i = 0; i < rows; i++) {
                                var cell = new Array();
                                for(var n = 0; n < fields.length; n++) {
                                     cell.push(data["rows"][i][fields[n]]);
                                };
                                            
                                var c = {
                                    "cell": cell
                                };
                                records.push(c);
                            };
                            data['page'] = this.currentpage;
                            data['total'] = totalPage;
                            data['rows'] = records;                            
                    };
                       
                //����jqGrid��������ҳ��õ���������ϢתΪjqGrid��ʶ�������
                var grid = this.jqGrid = jQuery(el).jqGrid({
                    url:newurl,
                    rowNum:limit,
                    sortname:sortField,
                    sortorder:"asc",
                    colModel: cm,
                    mtype: "POST",
                    datatype: datatype,
                    height: height,
                    multiselect: multiselect,
                    //width : 500,
                    autowidth: true,
                    shrinkToFit : false,
                    rowList:rowList,
                    pager: pager,
                    viewrecords: true,
                    cellEdit: true,
                    caption:title,
                    hidegrid: hidegrid,
                    postData: baseParams,
                    serializeGridData :serializeGridData,
                    beforeProcessing: beforeProcessing,
                    onRightClickRow: function(){},
                    ondblClickRow: function() {},
                    onHeaderClick: function() {},
                    loadBeforeSend: function(){}
                });
                
                jQuery(el).jqGrid('navGrid', pager, {
                    edit : false,
                    add : false,
                    del : false
                });
                
                this.initEvent();
                
                this.fireEvent('render', this);
                this.onAfterRender();
                return grid;
            }
        }, 
        
        //private 
        onAfterRender :   function() {
        	
        },
     	
        //private ��ʼ���¼�
        initEvent : function(){
            var me = this,
                jqGrid = me.jqGrid;
            
            //����һЩ�¼���Ϣ���뵽grid������Ϣ��
            jqGrid.jqGrid('setGridParam',{
            	
            	loadComplete: function() {
                	me.fireEvent('load',jqGrid);
                	return true;
                },
                loadError: function(xhr,status,error) {
                	me.fireEvent('loadError',xhr,status,error);
                	return true;
                },
                onPaging: function(t,p) {
                	me.fireEvent('onPaging',t,p);
                	return true;
                },
                afterInsertRow: function(idr,rd,cur) {
                	me.fireEvent('afterInsertRow',idr,rd,cur);
                	return true;
                },
                beforeSelectRow: function(rowid, e) {
                	me.fireEvent('beforeSelectRow',rowid, e);
                	return true;
                },
                onCellSelect: function(rowid,iRow,iCol,e) {
                	me.fireEvent('cellSelect',rowid,iRow,iCol,e);
                	return true;
                },
                onHeaderClick: function(gridstate) {
                	me.fireEvent('headerClick',gridstate);
                	return true;
                },
                ondblClickRow : function(rowid) {
                	me.fireEvent('dblClickRow',rowid);
                	return true;
                },
                onRightClickRow: function(rowid,iRow,iCol,e) {
                	me.fireEvent('rightClickRow',rowid,iRow,iCol,e);
                	return true;
                },
                onSortCol: function(index,iCol,sortorder) {
                	me.fireEvent('sortCol',index,iCol,sortorder);
                	return true;
                },
                resizeStart: function(e,i) {
                	me.fireEvent('resizeStart',e,i);
                	return true;
                },
                resizeStop: function(nw,i) {
                	me.fireEvent('resizeStop',nw,i);
                	return true;
                },
                onSelectCell: function(rowid, celname, value, iRow, iCol) {
                	me.fireEvent('selectCell',rowid, celname, value, iRow, iCol);
                	return true;
                }      
            }).trigger("reloadGrid");
        },
        
        /**
         * �������ñ��Ŀ��
         * 
         * @param {Number} width �µĿ��ֵ
         */
        setWidth : function(width) {
        	this.jqGrid.setGridWidth(width);
        },
        
        /**
         * �������ñ��ĸ߶�
         * 
         * @param {Number} height �µĸ߶�ֵ
         */
        setHeight : function(height) {
        	this.jqGrid.setGridHeight(height);
        },
        
        /**
         * �������ñ��ı���
         * 
         * @param {String} title �µı���
         */
        setTitle : function(title) {
        	this.jqGrid.setCaption(title);
        },
        
        /**
         * ���ҳ����
         * 
         */
        getTitle : function() {
        	return this.jqGrid.jqGrid('getGridParam','caption');
        },
        
        /**
         * �������ñ���url
         * 
         * @param {String} url �µ�url �����µ�url������
         * 	testdata.jsp?Rs-method= method & Rs-dataType =  datatype &Rs-accept=json  ��ʽ
         */
        setUrl : function(url) {
        	this.jqGrid.jqGrid('setGridParam',{url: url }).trigger("reloadGrid");
        },        
        
        /**
         * ��ȡurl
         * 
         */
        getUrl : function() {
        	return this.jqGrid.jqGrid('getGridParam','url');
        },
        
        /**
         * ��һ�н�������
         * 
         * @param {String}  colName Ҫ�����������
         * @param {String}	order ����Ĺ��� asc desc
         * 	
         */
        setColSort : function(colName , order) {
        	this.jqGrid.jqGrid('setGridParam',{sortname:colName,sortorder:order }).trigger("reloadGrid");
        },
        
        
        
        /**
         * ��������ҳ����¼��
         * 
         * @param {Number} limit ����
         * 	
         */
        setPageLimit : function(limit) {
        	this.jqGrid.jqGrid('setGridParam',{rowNum : limit}).trigger("reloadGrid");
        },
        
        /**
         * ��������ҳ���������ֵ
         * 
         * @param {Array} list ����
         * 	
         
        setRowList : function(list) {
        	this.jqGrid.jqGrid('setGridParam',{rowList : list}).trigger("reloadGrid");
        },
        */
        
        /**
         * ��ȡ��ǰҳ����¼��
         * 
         */
        getRowNum : function() {
        	return this.jqGrid.jqGrid('getGridParam','rowNum');
        },
        
        /**
         * ��ȡ��������ļ�¼��
         * 
         */
        getRecords : function() {
        	return this.jqGrid.jqGrid('getGridParam','records');
        },
        
        /**
         * ������id��ȡһ�е�����Ϣ
         * 
         * @param {Number} rowid ��id 
         */
        getRowData : function(rowid) {
        	return this.jqGrid.jqGrid('getRowData',rowid);
        },
        
        /**
         * ������idɾ��һ����Ϣ
         * 
         * @param {Number} rowid ��id 
         */
        delRowData : function(rowid) {
        	return this.jqGrid.jqGrid('delRowData',rowid);
        },
        
        /**
         * ����һ�е���Ϣ
         * 
         * @param {Number} rowid �����е���id 
         * @param {Json} value ��Ҫ���µ���Ϣ �磺{id: "01", name: "sd" ...}
         * id,name... ��cm�е���ô����ֵ���Ӧ
         */
        updateRowData : function(rowid,value) {
        	return this.jqGrid.jqGrid('setRowData',rowid,value);
        },
        
        /**
         * ����һ����Ϣ
         * 
         * @param {Number} rowid �����е���id 
         * @param {Json} value ���ӵ���Ϣ �磺{id: "01", name: "sd" ...}
         * 	id,name... ��cm�е���ô����ֵ���Ӧ
         * @param {String} pos ��������ڱ�ҳ�е�λ�� 
         * 		first��ҳ�ĵ�һ�� last �� ҳ�����һ�У�Ĭ����last
         */
        addRowData : function(rowid,value,pos) {
        	return this.jqGrid.jqGrid('addRowData',rowid,value,pos);
        }
        
        
    });
})();
