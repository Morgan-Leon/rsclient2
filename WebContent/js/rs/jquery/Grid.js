Rs.ns("Rs.jquery.Grid");

(function(){
	
	/**
	 * @class Rs.jquey.Grid
	 * @extend Rs.util.Observable
	 * 此类是对jqGird的封装，呈现出jqGrid的表格
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
                 * 当插入每行时触发
                 * @event afterInsertRow
                 * @param {Nubmer} rowid 插入当前行的id
                 * @param {String} rowdata 插入行的数据,格式为name: value，name为colModel中的名字。rowelem是从服务器返回的数据
                 * @param {String} rowelem 从服务器返回的数据,如果数据时xml则返回该行的xml数据，如果是json，就返回这行关于这行的所有数据的数组。
                 * @return {Boolean} boolean 如果返回true则插入完成，如果返回false则失败
                 */
        		'afterInsertRow',
				
                /**
                 * 当用户点击当前行在未选择此行时触发。
                 * @event beforeSelectRow
                 * @param {Nubmer} rowid 此行id
                 * @param {Event}e 事件对象
                 * @return {Boolean} boolean 如果返回true则选择完成，如果返回false则不会选择此行也不会触发其他事件
                 */
                'beforeSelectRow',
				/**
                 * 当从服务器返回响应时执行
                 * @event load
                 * @param {XMLHttpRequest} xhr XMLHttpRequest 对象
                 * @return {Boolean} boolean
                 */
				'load',
				/**
                 * 如果请求服务器失败则调用此方法
                 * @event loadError
                 * @param {XMLHttpRequest} xhr XMLHttpRequest 对象
                 * @param {String} status 错误类型
                 * @param {Exception} error exception对象
                 * @return {Boolean} boolean
                 */
				'loadError',
				/**
                 * 当点击单元格时触发。
                 * @event cellSelect
                 * @param {Nubmer} rowid 当前行id
                 * @param {Nubmer} iCol 当前单元格索引
                 * @param {String} cellcontent 当前单元格内容
                 * @param {Event} e event对象
                 * @return {Boolean} boolean
                 */
				'cellSelect',
                /**
                 * 当点击显示/隐藏表格的那个按钮时触发；
                 * @event headerClick
                 * @param {String} gridstate 表格状态，可选值：visible or hidden
                 * @return {Boolean} boolean
                 */
                'headerClick', 
                /**
                 * 点击翻页按钮填充数据之前触发此事件，同样当输入页码跳转页面时也会触发此事件
                 * @event onPaging
                 * @param {Nubmer} pgButton 翻页的按钮
                 * @return {Boolean} boolean
                 */
                'onPaging', 
				/**
                 * 右击行时触发。
                 * @event rightClickRow
                 * @param {Nubmer} rowid  当前行id
                 * @param {Number} iRow   当前行索引位置
                 * @param {Nubmer} iCol   当前单元格位置索引
                 * @parma {Event} e       event对象
                 * @return {Boolean} boolean
                 */
				'rightClickRow',
				/**
                 * 双击行时触发 
                 * @event rightClickRow
                 * @param {Nubmer} rowid 当前行id
                 * @return {Boolean} boolean 
                 */
				'dblClickRow',
				/**
                 * 选择行时触发此事件
                 * @event selectRow
                 * @param {Nubmer} rowid 当前行id
                 * @param {String} status 选择状态，当multiselect 为true时此参数才可用
                 * @return {Boolean} boolean
                 */
				'selectRow',
				/**
                 * 当点击排序列但是数据还未进行变化时触发此事件。
                 * @event sortCol
                 * @param {Number} index name在colModel中位置索引
                 * @param {Number} iCol 当前单元格位置索引
                 * @param {String} sortorder 排序状态：desc或者asc
                 * @return {Boolean} boolean
                 */
				'sortCol',
                /**
                 * 当开始改变一个列宽度时触发此事件
                 * @event resizeStart
                 * @param {Event} event event对象
                 * @param {Number} index 当前列在colModel中位置索引
                 * @return {Boolean} boolean
                 */
				'resizeStart',
                /**
                 * 当列宽度改变之后触发此事件
                 * @event resizeStop
                 * @param {Number} newwidth 列改变后的宽度
                 * @param {Number} index 当前列在colModel中的位置索引
                 * @return {Boolean} boolean
                 */
				'resizeStop',
				/**
                 * applies only to cells that are not editable; fires after the cell is selected
                 * @event selectCell
                 * @param rowid 当前行id
                 * @param celname 名字
                 * @param value 值
                 * @param iRow 当前行索引
                 * @param iCol 当前列索引
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
         * 当前页码,默认值为0
         * @cfg {Nubmer} currentpage
         */
        currentpage : 0,
        
        /**
         * 发送到后台的url
         * @cfg {String} url
         */
        
        /**
         * 后台jsp所对应的方法名称
         * @cfg {String} method 
         */
        method  : 'read', 
        
        /**
         * columnModes  
         * @cfg {Array} cm
         */
        
        /**
         * 表格是否可隐藏   true： 是； false：否
         * @cfg {Boolean} hidegrid
         */
        hidegrid : false ,
        
        /**
         * 初始化grid最多行数  
         * @cfg {Number} limit
         */
         rowNum : 10 ,
         
         /**
         * 初始化时哪一列 进行排序 
         * @cfg {String} sortField
         */        
         
         /**
          * 以哪种数据格式发送到后台 
          * @cfg {String} datatype
          */     
         datatype : "json" ,
         
         /**
         * grid 高度  
         * @cfg {Number} height
         */
         height : 350 , 
         
         /**
         * 参数配置，它最终会接到url后面传递到后台  
         * @cfg {Json} baseParams
         */
         
          /**
         * 表头名 
         * @cfg {String} title
         */
         
         /**
          * 第一列是否有复选框,默认为false 
          * @cfg {Boolean} multiselect
          */
         multiselect : false,
         
         /**
         * grid显示列的名称及顺序 
         * @cfg {Array} fields
         */
         
         /**
         * grid更改每页行数的下拉框的数值
         * @cfg {Array} rowList 默认 {10,50,100}
         */
         rowList : [10 , 50 , 100] ,
         /**
         * grid所要插入的div，以#开头
         * @cfg {String} pager
         */
         
        //private 
        onBeforeRender : function(){},
        
        /**
         *  当grid render之后执行
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
                    
                //url拼接成为Rs后台可以识别的url
                var newurl = url + "?Rs-method=" + method + "&Rs-dataType=" + datatype +"&Rs-accept=json";
                	
                
                //发送数据之前，对request参数数据进行改变成为Rs后台可以识别的数据格式   
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
                 	//将response后台得到的数据进行格式化，变成jqGrid表可以显示的数据的格式
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
                       
                //创建jqGrid，将我们页面得到的配置信息转为jqGrid可识别的配置
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
     	
        //private 初始化事件
        initEvent : function(){
            var me = this,
                jqGrid = me.jqGrid;
            
            //重新一些事件信息加入到grid配置信息中
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
         * 重新设置表格的宽度
         * 
         * @param {Number} width 新的宽度值
         */
        setWidth : function(width) {
        	this.jqGrid.setGridWidth(width);
        },
        
        /**
         * 重新设置表格的高度
         * 
         * @param {Number} height 新的高度值
         */
        setHeight : function(height) {
        	this.jqGrid.setGridHeight(height);
        },
        
        /**
         * 重新设置表格的标题
         * 
         * @param {String} title 新的标题
         */
        setTitle : function(title) {
        	this.jqGrid.setCaption(title);
        },
        
        /**
         * 获得页标题
         * 
         */
        getTitle : function() {
        	return this.jqGrid.jqGrid('getGridParam','caption');
        },
        
        /**
         * 重新设置表格的url
         * 
         * @param {String} url 新的url 但是新的url必须是
         * 	testdata.jsp?Rs-method= method & Rs-dataType =  datatype &Rs-accept=json  格式
         */
        setUrl : function(url) {
        	this.jqGrid.jqGrid('setGridParam',{url: url }).trigger("reloadGrid");
        },        
        
        /**
         * 获取url
         * 
         */
        getUrl : function() {
        	return this.jqGrid.jqGrid('getGridParam','url');
        },
        
        /**
         * 对一列进行排序
         * 
         * @param {String}  colName 要排序的列名称
         * @param {String}	order 排序的规则 asc desc
         * 	
         */
        setColSort : function(colName , order) {
        	this.jqGrid.jqGrid('setGridParam',{sortname:colName,sortorder:order }).trigger("reloadGrid");
        },
        
        
        
        /**
         * 重新设置页最大记录数
         * 
         * @param {Number} limit 行数
         * 	
         */
        setPageLimit : function(limit) {
        	this.jqGrid.jqGrid('setGridParam',{rowNum : limit}).trigger("reloadGrid");
        },
        
        /**
         * 重新设置页行下拉框的值
         * 
         * @param {Array} list 行数
         * 	
         
        setRowList : function(list) {
        	this.jqGrid.jqGrid('setGridParam',{rowList : list}).trigger("reloadGrid");
        },
        */
        
        /**
         * 获取当前页最大记录数
         * 
         */
        getRowNum : function() {
        	return this.jqGrid.jqGrid('getGridParam','rowNum');
        },
        
        /**
         * 获取本次请求的记录数
         * 
         */
        getRecords : function() {
        	return this.jqGrid.jqGrid('getGridParam','records');
        },
        
        /**
         * 根据行id获取一行的行信息
         * 
         * @param {Number} rowid 行id 
         */
        getRowData : function(rowid) {
        	return this.jqGrid.jqGrid('getRowData',rowid);
        },
        
        /**
         * 根据行id删除一行信息
         * 
         * @param {Number} rowid 行id 
         */
        delRowData : function(rowid) {
        	return this.jqGrid.jqGrid('delRowData',rowid);
        },
        
        /**
         * 更新一行的信息
         * 
         * @param {Number} rowid 更新行的行id 
         * @param {Json} value 想要更新的信息 如：{id: "01", name: "sd" ...}
         * id,name... 是cm中的那么属性值相对应
         */
        updateRowData : function(rowid,value) {
        	return this.jqGrid.jqGrid('setRowData',rowid,value);
        },
        
        /**
         * 增加一行信息
         * 
         * @param {Number} rowid 新增行的行id 
         * @param {Json} value 增加的信息 如：{id: "01", name: "sd" ...}
         * 	id,name... 是cm中的那么属性值相对应
         * @param {String} pos 加入的行在本页中的位置 
         * 		first：页的第一行 last ： 页的最后一行，默认是last
         */
        addRowData : function(rowid,value,pos) {
        	return this.jqGrid.jqGrid('addRowData',rowid,value,pos);
        }
        
        
    });
})();
