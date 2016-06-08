Ext.ns("Rs.ext.form");
(function(){
    /**
     * @class Rs.ext.form.KindEditorPanel
     * @extends Ext.Panel
     * @constructor
     * @param {Object} config Configuration options
     * @xtype rs-ext-kindeditorpanel
     */
    Rs.ext.form.KindEditorPanel =  function(config){
        //提供2种方式路径配置
        if(!config.uploadJson && config.upload){
            var upload = config.upload ;
            config.uploadJson = upload.url + '?Rs-method=' + upload.method + "&Rs-accept=html&fileDir=" + upload.fileDir ;
            delete config.upload ;
        }
        Ext.apply(this, config);
        Rs.ext.form.KindEditorPanel.superclass.constructor.apply(this, arguments);
    }
    
    Ext.extend(Rs.ext.form.KindEditorPanel , Ext.Panel , {
        /**
         * @cfg {Array} 配置编辑器的工具栏，其中"-"表示换行，"|"表示分隔符。
         */
        editoritems : [
            'source', '|', 'undo', 'redo', '|' ,'print', 'rstemplate', 'code', 'cut', 'copy',
            'paste','plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
            'flash', 'media','insertVideo' , 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink', '|', 'about'
        ],
        /**
         * @cfg {Boolean} 2 或1 或0，2 时可以拖动改变宽度和高度，1 时只能改变高度，0 时不能拖动 (默认：2)
         */
        resizeType : 2 ,
        /**
         * @cfg {String} 编辑器提交请求地址
         * 例如 uploadJson: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa&Rs-accept=html',
         * 需要携带3个参数:Rs-method , fileDir , Rs-accept
         */
        uploadJson : '' ,
        /**
         * @cfg {Object} 
         */
        upload : {} ,
        
        height : 500 ,
        
        width : '90%' ,
        
        editorConfig : {} ,
        
        htmlEditor : {} ,
        
        onRender : function(ct , position){
            Rs.ext.form.KindEditorPanel.superclass.onRender.apply(this, arguments);
            var K = KindEditor  ,
                el = Ext.getDom(ct.dom) ,
                len = el.childNodes.length ,
                dom ;
            function getNode(dom){
                if(Ext.getDom(dom).childNodes.length > 0){
                    return getNode(dom.childNodes[0]);
                } else {
                    return dom ;
                }
            }
            if(len){
               dom = getNode(ct.dom);
            }
            Rs.apply(this.editorConfig || {} ,{
                items : this.editoritems,
                uploadJson : this.uploadJson ,
                height: this.height ,
                filterMode : false ,//true时过滤HTML代码,false时允许输入任何代码.默认值：false
                width: this.width ,
                resizeType: this.resizeType//2 或1 或0，2 时可以拖动改变宽度和高度，1 时只能改变高度，0 时不能拖动。
            });
            htmlEditor = K.create(dom , this.editorConfig);
        } ,
        
        /**
         * 设置编辑器内容
         */
        setValue : function(value){
            this.getEditor().html(value);
        } ,
        
        /**
         * 返回编辑器内容
         */
        getValue : function(){
            return htmlEditor.html();
        } ,
        
        /**
         * 清除编辑器内容
         */
        clearValue : function(){
            htmlEditor.html('');
        } ,
        
        /**
         * 获取KindEditor
         */
        getEditor : function(){
            return htmlEditor ;
        }
    });
    Ext.reg('kindeditor', Rs.ext.form.KindEditorPanel);
})();