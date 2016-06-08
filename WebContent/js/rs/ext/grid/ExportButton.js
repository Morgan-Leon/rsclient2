Ext.ns("Rs.ext.grid");
(
function(){
    /**
     * @class Rs.ext.grid.ExportButton
     * 表格数据导出按钮
     * @extends Ext.Button
     * @constructor
     * @param {Object} config 
     */
    Rs.ext.grid.ExportButton = Ext.extend(Ext.Button,{
        /**
         * @cfg {Object} grid 导出按钮绑定的表格
         */
        /**
         * @cfg {String} filename 导出文件名
         */
    	
    	/**
    	 * @cfg {String} exportFileUrl 下载文件服务地址
    	 */
    	
        /**
         * @cfg {Boolean} paging 是否分页，默认为false
         */
        paging : false,
        
        /**
         * @cfg {String} text 导出按钮上显示的内容,默认为导出CSV文件
         */
        text: '导出CSV文件',
        
        iconCls : 'rs-action-export',
        /**
         * @cfg {Boolean} visibleOnly 是否导出隐藏列，默认为true ,flase 表示导出所有列,包括隐藏列 , true 只导出显示列
         */
        visibleOnly : true,
        
        /**
         * @cfg {Array} headers 指定导出的表头二维数组，默认为表格当前列名，例：
         * * <pre><code>
         [["第一列字段名","第一列表头名"],["第二列字段名","第二列表头名"]]
         * </code></pre>
         */
        /*
         * private
         */
        handler : function(){
            var store = this.grid.getStore();
            //var bp = store.baseParams ;
            var bp = store.lastOptions.params;
            if(typeof(bp) =='undefined' ){
                bp = store.baseParams ;
            }
            /*if(!this.header){
                this.header = this.getHeader();
            }*/
            this.header = this.getHeader();
            var service = new Rs.data.Service({
                url : store.readUrl || store.url,
                method : 'export',
                accept : 'json',
                timeout : 3000000
            });
            //当用户点击导出按钮后
            //this.setText("生成CSV文件");  //将按钮上的内容替换成"生成CSV文件"
            this.setIconClass('rs-action-exporting');//并设置图标样式为"rs-action-exporting"
            this.disable();//将按钮设置成disable状态,防止用户重复点击导出
            this.removeClass(this.disabledClass);//移除设置disable状态的样式
            
            service.call( {
                params : { 
                    params : Ext.apply({
                        header : this.header,
                        paging : this.paging
                    }, bp)
                }
            },
            
            function(fileinfo) {
                //导出完成后             
                this.enable();//将按钮状态修改为可点击状态   
                //this.setText("导出CSV文件");//将按钮上的内容替换成"导出CSV文件"
                this.setIconClass("rs-action-export");//并设置图标样式为"rs-action-export"
                
                var frame = Ext.fly(this.id+"-iframe");
                if(frame){
                    frame.remove();
                }
                frame = Ext.DomHelper.append(Ext.getBody(), {
                    tag : "div",
                    id : this.id+"-iframe",
                    style : "display:none",
                    html : "<iframe src='" + (Ext.isEmpty(this.exportFileUrl, false)?'/rsc/rsclient/export':this.exportFileUrl) + "?sfilename=" 
                        + fileinfo.filename
                        + "&cfilename=" + encodeURIComponent(encodeURIComponent(this.filename+".csv"))+"'></iframe>"
                });
            }, this);
        },

        /*
         * private
         */
        getHeader : function(){
            var header = [];
            var colModle = this.grid.getColumnModel();
            var colnumbers = colModle.getColumnCount();
            if(this.visibleOnly){ //true 只导出显示列
                for(var i = 0; i < colnumbers; i++){
                    if(!colModle.isHidden(i)){
                        var index = colModle.getDataIndex(i);
                        if(index){
                            var colHeader = [];
                            colHeader[0] = index;
                            colHeader[1] = colModle.getColumnHeader(i);
                            colHeader[2] = colModle.config[i].summaryType ;
                            if(colHeader[2] && (typeof colHeader[2] === 'string')){
                            	colHeader[2] = {
                            		type : colModle.config[i].summaryType ,
                            		decimalPrecision : 2
                            	}
                            }
                            header.push(colHeader);
                        }
                    }
                }
            } else{ //false 导出所有列
                for(var i = 0; i < colnumbers; i++){
                    var index = colModle.getDataIndex(i);
                    if(index){
                        var colHeader = [];
                        colHeader[0] = index;
                        colHeader[1] = colModle.getColumnHeader(i);
                        colHeader[2] = colModle.config[i].summaryType ;
                        if(colHeader[2] && (typeof colHeader[2] === 'string')){
                        	colHeader[2] = {
                        		type : colModle.config[i].summaryType ,
                        		decimalPrecision : 2
                        	}
                        }
                        header.push(colHeader);
                    }
                }
            }
            return header;
        }
    });
}
)();