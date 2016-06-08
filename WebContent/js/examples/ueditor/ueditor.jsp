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
    	<h1>UEditor简单功能</h1>
	    <!--style给定宽度可以影响编辑器的最终宽度-->
	    <script type="text/plain" id="myEditor"><p>这里我可以写一些输入提示</p></script>
	    <script type="text/javascript">
	        UE.getEditor('myEditor',{
	        	imageUrl :  '/rsc/rsclient/attachment?Rs-method=upload&fileDir=oa' ,
				imagePath : '' ,
	            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
	            //toolbars:[['FullScreen', 'Source', 'Undo', 'Redo','Bold','test']],
	            //focus时自动清空初始化时的内容
	            autoClearinitialContent:true,
	            //关闭字数统计
	            wordCount:false,
	            //关闭elementPath
	            elementPathEnabled:false,
	            //默认的编辑区域高度
	            initialFrameHeight:300
	            //更多其他参数，请参考ueditor.config.js中的配置项
	        })
	    </script>
    </body>
</html>