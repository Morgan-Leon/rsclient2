<%@page contentType="text/html;charset=gbk" pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html>
    <head>
        <meta http-equiv = "content-type" content = "text/html; charset=gbk" >
        <title>ExtJs UEditor</title>
        <script type="text/javascript" src="/rsc/js/rs/lib/ueditor1_2_6_1/ueditor.config.js"></script>
        <script type="text/javascript" src="/rsc/js/rs/lib/ueditor1_2_6_1/ueditor.all.js"></script>
    </head>
    <body>
    	<h1>UEditor�򵥹���</h1>
	    <!--style������ȿ���Ӱ��༭�������տ��-->
	    <script type="text/plain" id="myEditor"><p>�����ҿ���дһЩ������ʾ</p></script>
	    <script type="text/javascript">
	        UE.getEditor('myEditor',{
	        	imageUrl :  '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa' ,
				imagePath : '' ,
	            //�������ѡ���Լ���Ҫ�Ĺ��߰�ť����,�˴���ѡ���������
	            //toolbars:[['FullScreen', 'Source', 'Undo', 'Redo','Bold','test']],
	            //focusʱ�Զ���ճ�ʼ��ʱ������
	            autoClearinitialContent:true,
	            //�ر�����ͳ��
	            wordCount:false,
	            //�ر�elementPath
	            elementPathEnabled:false,
	            //Ĭ�ϵı༭����߶�
	            initialFrameHeight:300
	            //����������������ο�ueditor.config.js�е�������
	        })
	    </script>
    </body>
</html>