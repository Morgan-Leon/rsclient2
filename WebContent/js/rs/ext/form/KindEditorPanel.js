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
        //�ṩ2�ַ�ʽ·������
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
         * @cfg {Array} ���ñ༭���Ĺ�����������"-"��ʾ���У�"|"��ʾ�ָ�����
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
         * @cfg {Boolean} 2 ��1 ��0��2 ʱ�����϶��ı��Ⱥ͸߶ȣ�1 ʱֻ�ܸı�߶ȣ�0 ʱ�����϶� (Ĭ�ϣ�2)
         */
        resizeType : 2 ,
        /**
         * @cfg {String} �༭���ύ�����ַ
         * ���� uploadJson: '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa&Rs-accept=html',
         * ��ҪЯ��3������:Rs-method , fileDir , Rs-accept
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
                filterMode : false ,//trueʱ����HTML����,falseʱ���������κδ���.Ĭ��ֵ��false
                width: this.width ,
                resizeType: this.resizeType//2 ��1 ��0��2 ʱ�����϶��ı��Ⱥ͸߶ȣ�1 ʱֻ�ܸı�߶ȣ�0 ʱ�����϶���
            });
            htmlEditor = K.create(dom , this.editorConfig);
        } ,
        
        /**
         * ���ñ༭������
         */
        setValue : function(value){
            this.getEditor().html(value);
        } ,
        
        /**
         * ���ر༭������
         */
        getValue : function(){
            return htmlEditor.html();
        } ,
        
        /**
         * ����༭������
         */
        clearValue : function(){
            htmlEditor.html('');
        } ,
        
        /**
         * ��ȡKindEditor
         */
        getEditor : function(){
            return htmlEditor ;
        }
    });
    Ext.reg('kindeditor', Rs.ext.form.KindEditorPanel);
})();