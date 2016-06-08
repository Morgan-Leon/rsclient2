<%@ page language="java" contentType="text/html; charset=GB2312"
    pageEncoding="GB2312"
%>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=GB2312">
		<title>前端开发帮助文档和模板程序</title>		
	</head>
	<style type="text/css">
		body {
			background-color : #E0E0E0;
		}
		a:link { 
			text-decoration : none;
			color : #4169E1;
		}
		a:hover { 
			text-decoration : none;
			color : #228B22;
			font-weight : bold;
		}
		a:active { 
			text-decoration : none;
			color : #4169E1;
		}
		a:visited { 
			text-decoration : none;
			color : #4169E1;
		}
		.title {
			text-align : center;
			font-size : 36px;
			font-weight : bold;
			color : #4169E1;
		}
		.title1 {
			font-size : 24px;
			font-weight : bold;
			color : #4169E1;
		}
		.panel {
			padding-left : 100px;
			padding-right: 100px;
		}
		.menu {
			list-style-type:decimal;
			font-size : 20px;
		}
	</style>
<body>
	
	<div class="title">前端开发帮助文档和模板程序</div>
	
	<hr />
	<div class="panel">
		<div class="title1">帮助文档</div>
		<ul class="menu">
			<li><a href="docs/index.html">RS富客户端框架开发帮助文档</a></li>
			<li><a href="../javadocs/index.html">Rs Java程序开发帮助文档</a></li>
			<li><a href="/rsc/js/rs/lib/ext-3.3.1/docs/index.html">ExtJs 3.3.1 开发帮助文档</a></li>
		</ul>
		
		<div class="title1">标准按钮样式</div>
	    <ul class="menu">
	    	<li><a href="examples/demo/button/button.jsp">按钮样式</a></li>
	    </ul>
		
		<div class="title1">AJAX</div>
		<ul class="menu">
			<li><a href="examples/ajax/index.html">异步请求示例</a></li>
			<li><a href="examples/service/index.html">后台可获取数据类型示例</a></li>
		</ul>
		
	    <div class="title1">模板程序:</div>
		<ul class="menu">
			<li><a href="examples/demo/inv/inv1100/inv1100.jsp">列表页面(模板仓库定义)</a></li>
			<li><a href="examples/demo/inv/inv0000/inv0000.jsp">卡片页面(物料定义)</a></li>
			<li><a href="examples/demo/edm/edm2y00/edm2y00.jsp">树组件(物料清单定义)</a></li> 
		    <li><a href="examples/demo/opa/opa7400/opa7400.jsp">树表格组件(订单跟踪)</a></li>
		    <li><a href="examples/demo/pm/pm4700/pm4700.jsp">头明细维护表单(接收单录入 pm4700)</a></li>
		    <li><a href="examples/demo/om/om6f00/om6f00.jsp">两帧页面(上下帧-订单批冻结om6f00)</a></li>
		    <li><a href="examples/demo/telescopetemplete/pmtelescope.jsp">望远镜面板</a></li>
		    <li><a href="examples/export/index.html">表格和望远镜数据导出</a></li>
		    <li><a href="examples/export/index.html">合计行例子</a></li>
		    <li><a href="examples/app/template/form/index.html">卡片页模板</a></li>
		    <li><a href="examples/app/template/maintenance/m1/index.html">维护页面模板一</a></li>
		    <li><a href="examples/app/template/maintenance/m2/index.html">维护页面模板二</a></li>
		    <li><a href="examples/app/template/maintenance/m3/index.html">维护页面模板三</a></li>
		    <li><a href="examples/app/template/maintenance/m4/index.html">维护页面模板四</a></li>
		    <li><a href="examples/app/template/maintenance/m5/index.html">维护页面模板五</a></li>
		    <li><a href="examples/app/template/query/index.html">查询模板</a></li>
		    
		    <li><a href="examples/ext/state/index.html">用户偏好示例</a></li>
			<li><a href="examples/ext/tree/index.html">分页树</a></li>
			<li><a href="examples/ext/data/index.html">支持增、删、改、查的store示例</a></li>
			<li><a href="examples/ext/grid/gridwithroweditor.html">行编辑插件示例</a></li>
			<li><a href="examples/ext/data/index2.html">循环发送请求测试</a></li>
			<li><a href="examples/ext/data/index3.html">望远镜store测试</a></li>
			<li><a href="examples/ext/grid/groupinggrid.html">分组store示例</a></li>
			<li><a href="examples/ext/grid/grid.html">分页表格及可复制选中单元格示例</a></li>
			
			<!-- 
			<li><a href="examples/ext/grid/GridSummary.html">表格当前页合计插件示例</a></li>
			 -->
			 
			<li><a href="examples/ext/grid/GridwithGridSummary.html">表格页合计插件与总合计插件示例</a></li>
			<li><a href="examples/ext/grid/gridwithgridsummary2.html">分组合计插件示例</a></li>
			<li><a href="examples/ext/grid/gridwithrowexpander.html">行展开插件示例</a></li>
			<li><a href="examples/ext/grid/lockinggrid.html">可锁定列表格示例</a></li>
			<li><a href="examples/ext/data/gridtest.html">多列表格测试</a></li>
			<li><a href="examples/ext/data/gridtestwithbufferview.html">带有缓存的多列表格测试</a></li>
			<li><a href="examples/ext/grid/treegrid.html">树表格示例</a></li>
			<li><a href="examples/ext/state/treegridpanelstate.html">带有用户偏好插件的树表格</a></li>
			<li><a href="examples/ext/grid/generalsel.html">望远镜表格示例</a></li>
			<li><a href="examples/ext/grid/generalselpanel.html">望远镜panel示例</a></li>
			<li><a href="examples/ext/grid/generalselpanel2.html">带有查询面板配置参数的望远镜panel示例</a></li>
			<li><a href="examples/ext/field/period.html">年月选择器示例</a><b style="color:red;">*</b></li>
			<li><a href="examples/ext/field/telescope.html">单、多选望远镜示例</a></li>
			<li><a href="examples/ext/field/suggestTag.html">建议文本框和望远镜用法和区别</a></li>
			<li><a href="examples/ext/field/singleupload.html">单文件上传示例</a></li>
			<li><a href="examples/ext/field/treecombobox.html">树下拉框示例</a></li>
			<li><a href="examples/ext/query/index.html">带有用户偏好插件的查询面板</a></li>
			<li><a href="examples/ext/query/querywithperiod.html">带有用户偏好插件及核算期控件的查询面板</a></li>
			 
			
			<li><a href="examples/ext/form/multiuploader.html">上传|下载示例</a></li>
			<!-- 
			<li><a href="examples/ext/attachment/download.html">下载示例</a></li>
		    <li><a href="examples/ext/attachment/upload.html">上传示例</a></li>
		    -->
		    <li><a href="examples/kind/kind.jsp">上传组件，编辑器组件</a></li>
			<li><a href="examples/ext/form/formpanel.html">表单面板</a></li>
			<li><a href="examples/ext/form/numberfield.html">千分符的数字控件</a></li>
			<li><a href="examples/ext/form/timefield.html">时间控件</a></li>
			<li><a href="examples/ext/form/autoCompleteField.html">自动完成控件</a></li>
			
			<li><a href="examples/ext/form/colorfield.html">颜色选择器</a></li>
			<li><a href="examples/ext/messagebox.html">消息提示框</a></li>
		
		</ul>	
		<!-- 
		<div class="title1">图表组件</div>
		<ul class="menu">
		
		    <li><a href="examples/fusioncharts/column.html">三维图形示例</a></li>
		    <li><a href="examples/fusioncharts/pie.html">二维图形示例</a></li>
		    <li><a href="examples/jquery/jqGrid/index2.html">多列jqGrid表格测试</a></li>
		    <li><a href="examples/jquery/jqGrid/index21.html">带有列复选框及cell可编辑的grid</a></li>
		    
		    <li><a href="examples/fusioncharts/oo/o1.html">图表组件一</a></li>
		    <li><a href="examples/fusioncharts/oo/o2.html">图表组件二</a></li>
		    <li><a href="examples/fusioncharts/oo/o3.html">图表组件三</a></li>
		    <li><a href="examples/fusioncharts/oo/o4.html">图表组件四</a></li>					
		</ul>
		-->
		
		
		<div class="title1">APP:</div>
		<ul class="menu">
			<li><a href="examples/app/hiApp/index.html">应用程序DEMO1</a></li>
			<li><a href="examples/app/hiApp2/index.html">应用程序DEMO2</a></li>
			<li><a href="examples/app/gridApp/index.html">表格</a></li>
			<li><a href="examples/app/windowApp/index.html">桌面窗口</a></li>
		    <li><a href="examples/app/windowApp/index2.html">Border布局</a></li>
		    <li><a href="examples/app/windowApp/index3.html">Tab布局</a></li>
		    <li><a href="examples/app/dimDefPage/index.html">维度定义</a></li>
		    <li><a href="examples/app/classdef/index.html">类定义</a></li>
		    <li><a href="examples/app/tabApp/index.html">TAB类型页面布局</a></li>
		    
		    <li><a href="examples/app/demo/panel/index.html">面板</a></li>
		    <li><a href="examples/app/demo/grid/index.html">表格</a></li>
		    <li><a href="examples/app/demo/chart/index.html">图表</a></li>
		    <li><a href="examples/app/demo/tree/index.html">树</a></li>
	    </ul>
		   
	    <!-- 
	    <br/>
	    <b>rs examples:</b><br/>
	    <a href="examples/helloworld/index.html">第一步</a><br/>
	    <a href="examples/event/index.html">事件机制</a><br/>
	    <a href="examples/more/index.html">基本数据类型扩展</a><br/>
	    <a href="examples/clipboard/index.html">剪贴板</a><br/>
	    <a href="examples/tabs/index.html">tabs面板</a><br/>
	    <a href="examples/rating/index.html">等级评定</a><br/>
	    <a href="examples/menu/index.html">菜单</a><br/>
	    <a href="examples/lightbox/index.html">照片</a><br/>
	    <a href="examples/jsonp/index.html">JSONP</a><br/>
	    <a href="examples/combo/index.html">COMBO</a><br/>
	    <a href="examples/carousel/index.html">CAROUSEL</a><br/>
	    -->
	     
	    <!-- 
	    <br/>
	    <b>mxgraph examples:</b><br/>
	    <a href="examples/mxgraph/helloworld.html">hello wrold</a><br/>
	    <a href="examples/mxgraph/codec.html">codec</a><br/>
	    <a href="examples/mxgraph/dynamicstyle.html">dynamicstyle</a><br/>
	    <a href="examples/mxgraph/events.html">events</a><br/>
	    <a href="examples/mxgraph/fileio.html">fileio</a><br/>
	    <a href="examples/mxgraph/fixedicon.html">fixedicon</a><br/>
	    <a href="examples/mxgraph/fixedpoints.html">fixedpoints</a><br/>
	    <a href="examples/mxgraph/guides.html">guides</a><br/>
	    <br />
	    <a href="examples/mxgraph/rsgraph.html">rsgraph</a><br/>
	    <a href="examples/mxgraph/pqm.html">pqm</a><br/>
	    -->
	    
	    <!--  
	    <br/>
	    <b>jquery examples:</b><br/>
	    <a href="examples/jquery/ajax/index.html">jQuery AJAX</a><br/>
	    -->
	    
	    <br />
    </div>
</body>
<script type="text/javascript">
	
</script>
</html>