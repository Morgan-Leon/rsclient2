
--- 1 同步的读取用户默认偏好信息,只有一个用户偏好信息设置。

--- 2 组合的 app

=== 3 只是后台运行的app

--- 7 用户信息的统一维护服务 安全性的考虑

--- 4   Border类型的shell，使用stateful，在调整页面宽度的时候没有产生作用。
--- 4.1 窗口初始化后直接进行调整大小时，在底部出现偏差的问题，经过一次调整后则无次问题。
--- 4.2 窗口移动的问题
--- 4.3 Border类型的布局程序位置使用east west等进行配置
--- 4.4 调整窗口大小 当窗口最大化后，记录了用户操作，重新打开没保存最大化状态
--- 4.5 打开很多窗口，在任务栏放不下的时候出现遮挡的问题
--- 4.6 鼠标拖动窗口至浏览器上端，在浏览器外松开鼠标，回到浏览器内，窗口仍为被拖动状态
--- 4.7 窗口切换时有时切换不到前边来的问题
--- 4.8 IE浏览器兼容css问题
--- 4.9 Rs.define Rs.create方法,类的定义和实例的创建
--- 5.0 Environment 开发完成

6   开发TAB类型的应用程序布局样式

7   系统主题设置

8   框架整体测试。
          主要是border类型shell的测试以及border中窗口程序的测试，window类型shell的测试暂缓
          测试浏览器:IE7, IE8, FF, Chrome, Safari 
          
          开始编写比较复杂的业务程序

9   项目程序管理的问题

10  Loading  系统设置面板

12  测试框架

13 代码部署工具，将编辑好的代码部署到websphere服务器上


 production
 
 development 

道可道，非常道。名可名，非常名。 
无名天地之始；有名万物之母。 故常无，欲以观其妙；常有，欲以观其徼。 
此两者，同出而异名，同谓之玄。玄之又玄，众妙之门。



DEMO程序开发
        应用程序列表：
   1 包含查询面板的查询页面

	setTimeout和setInterval的使用

关键点	序号	任务名称	开始日期	结束日期	主要工作内容	参加人	计划人日	备注

	1	Tab布局类型Shell测试	2012-5-2	2012-5-4	
	对蔡璐璐开发的Tab类型布局进行详细测试，并编写相应测试代码。	
	常虎	3	主要包括在单个engine中以及组合应用程序中的使用。

√	2	编写API	2012-5-2	2012-5-11	
	检查代码补充注释并生成API	
	蔡璐璐	8	补充编写代码注释并生成API，同时对代码进行白盒测试。

	3	程序主题功能开发	2012-5-7	2012-5-11	
	开发页面主题样式以及主题维护功能模块	
	常虎		5	开发除默认程序主题外的两个新的主题样式。

√	4	RS10系统兼容性测试	2012-5-2	2012-5-9	
	websphere7对RS10系统的支持研究	
	侯佳佳	6	主要测试OA和工作流系统在websphere7上的使用情况。

	5	框架整体测试	2012-5-10	2012-5-18	
	编写测试代码并进行详细测试。主要测试内容为之前开发的前端应用组件在app程序使用情况。	
	常虎、蔡璐璐、侯佳佳		5+5+6	进行详细的整体测试并修改bug。侯佳佳以程序开发人员的角度使用该框架，对框架所提供的各种功能特性进行深度使用。常虎和蔡璐璐负责修改bug

√	6	前端代码开发规范编写	2012-5-21	2012-5-25	
	编写前端应用程序的开发规范	
	常虎	5	编写前端应用程序开发规范并在周五的技术论坛上进行讨论。

	7	产品移交						

√	8	后期维护						

审批意见								
	编制人：常虎        编制日期：2012-4-27  审核人：          日期：          批准人：          日期：                							


