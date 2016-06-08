Ext.ns("Rs.ext.grid");
(
function(){
    /**
     * @class Rs.ext.grid.ExportButton
     * ������ݵ�����ť
     * @extends Ext.Button
     * @constructor
     * @param {Object} config 
     */
    Rs.ext.grid.ExportButton = Ext.extend(Ext.Button,{
        /**
         * @cfg {Object} grid ������ť�󶨵ı��
         */
        /**
         * @cfg {String} filename �����ļ���
         */
    	
    	/**
    	 * @cfg {String} exportFileUrl �����ļ������ַ
    	 */
    	
        /**
         * @cfg {Boolean} paging �Ƿ��ҳ��Ĭ��Ϊfalse
         */
        paging : false,
        
        /**
         * @cfg {String} text ������ť����ʾ������,Ĭ��Ϊ����CSV�ļ�
         */
        text: '����CSV�ļ�',
        
        iconCls : 'rs-action-export',
        /**
         * @cfg {Boolean} visibleOnly �Ƿ񵼳������У�Ĭ��Ϊtrue ,flase ��ʾ����������,���������� , true ֻ������ʾ��
         */
        visibleOnly : true,
        
        /**
         * @cfg {Array} headers ָ�������ı�ͷ��ά���飬Ĭ��Ϊ���ǰ����������
         * * <pre><code>
         [["��һ���ֶ���","��һ�б�ͷ��"],["�ڶ����ֶ���","�ڶ��б�ͷ��"]]
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
            //���û����������ť��
            //this.setText("����CSV�ļ�");  //����ť�ϵ������滻��"����CSV�ļ�"
            this.setIconClass('rs-action-exporting');//������ͼ����ʽΪ"rs-action-exporting"
            this.disable();//����ť���ó�disable״̬,��ֹ�û��ظ��������
            this.removeClass(this.disabledClass);//�Ƴ�����disable״̬����ʽ
            
            service.call( {
                params : { 
                    params : Ext.apply({
                        header : this.header,
                        paging : this.paging
                    }, bp)
                }
            },
            
            function(fileinfo) {
                //������ɺ�             
                this.enable();//����ť״̬�޸�Ϊ�ɵ��״̬   
                //this.setText("����CSV�ļ�");//����ť�ϵ������滻��"����CSV�ļ�"
                this.setIconClass("rs-action-export");//������ͼ����ʽΪ"rs-action-export"
                
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
            if(this.visibleOnly){ //true ֻ������ʾ��
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
            } else{ //false ����������
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