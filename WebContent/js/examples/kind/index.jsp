<!doctype html>
<%
    String url = "/rsc/rsclient/attachment?attachmentId=22&attachmentIndex=1&Rs-method=read" ;
%>

<html>
    <head>
        <meta charset="utf-8" />
        <title>插件效果展示</title>
        <script type="text/javascript" src="/rsc/js/rs/lib/kindeditor/plugins/insertVideo/ckplayer/ckplayer.js"></script>
    </head>
    <body>
        <div id="ckplayerBox">
           <img src="/rsc/js/rs/lib/kindeditor/plugins/insertVideo/ckplayer/assets/ckplayer.jpg" style="width:550px;height:400px;" />
        </div>
        <script type="text/javascript">
        	   var flashvars={f:'<%=url%>',p:'0'};
			   var params={bgcolor:'#000000',allowFullScreen:true,allowScriptAccess:'always'};
			   var attributes={id:'ckplayer_a1',name:'ckplayer_a1'};
			   swfobject.embedSWF('/rsc/js/rs/lib/kindeditor/plugins/insertVideo/ckplayer/ckplayer.swf', 'ckplayerBox', '550', '400', '10.0.0','/rsc/js/rs/lib/kindeditor/plugins/insertVideo/ckplayer/expressInstall.swf', flashvars, params, attributes); 
		</script>
    </body>
</html>
