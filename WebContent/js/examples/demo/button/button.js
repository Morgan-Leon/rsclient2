Rs.define('Button' , {

    extend : Ext.Panel ,
    
    mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		
		Ext.QuickTips.init();
		
		var store = new Ext.data.JsonStore({
			fields:['className', 'name'],
			data: [{className: 'rs-action-attribute',name: '属性定义'},
			       {className: 'rs-action-power',name: '权限定义'},
			       {className: 'rs-action-reset',name: '重置'},
			       {className: 'rs-action-ok',name: '确定'},
			       {className: 'rs-action-seniorquery',name: '高级查询'},
			       {className: 'rs-action-savedraft',name: '存草稿'},
			       {className: 'rs-action-bacthgoleft',name: '批量传递(向左)'},
			       {className: 'rs-action-bacthgoright',name: '批量传递(向右)'},
			       {className: 'rs-action-goleft',name: '传递(向左)'},
			       {className: 'rs-action-goright',name: '传递(向右)'},
			       {className: 'rs-action-carryover',name: '结转'},
			       {className: 'rs-action-submit',name: '提交'},
			       {className: 'rs-action-reject',name: '驳回'},
			       {className: 'rs-action-editfind',name: '查阅情况'},
			       {className: 'rs-action-stop',name: '终止'},
			       {className: 'rs-action-colse',name: '关闭'},
			       {className: 'rs-action-favorite',name: '收藏'},
			       {className: 'rs-action-loseeffect',name: '失效'},
			       {className: 'rs-action-effect',name: '生效'},
			       {className: 'rs-action-goback',name: '返回'},
			       {className: 'rs-action-create',name: '新建'},
			       {className: 'rs-action-batchdelete',name: '删除(批量)'},
			       {className: 'rs-action-delete',name: '删除(逐条)'},
			       {className: 'rs-action-unread',name: '未读'},
			       {className: 'rs-action-read',name: '已读'},
			       {className: 'rs-action-detail',name: '详细'},
			       {className: 'rs-action-previous',name: '上一条'},
			       {className: 'rs-action-next',name: '下一条'},
			       {className: 'rs-action-exporting',name: '导出中'},
			       {className: 'rs-action-export',name: '导出'},
			       {className: 'rs-action-reject',name: '驳回'},
			       {className: 'rs-action-audit',name: '审核'},
			       {className: 'rs-action-rename',name: '重命名'},
			       {className: 'rs-action-reset',name: '重置'},
			       {className: 'rs-action-query',name: '查询'},
			       {className: 'rs-action-querypanel',name: '查询面板'},
			       {className: 'rs-action-settings',name: '设置'},
			       {className: 'rs-action-apply',name: '应用'},
			       {className: 'rs-action-exception',name: '异常'},
			       {className: 'rs-action-scheme',name: '保存方案'},
			       {className: 'rs-action-condition',name: '条件'},
			       {className: 'rs-action-batch',name: '成批接收'},
			       {className: 'rs-action-help',name: '帮助'},
			       {className: 'rs-action-download-disable',name: '不允许下载'},
			       {className: 'rs-action-download-enable',name: '运行下载'},
			       {className: 'rs-action-modify',name: '修改'},
			       {className: 'rs-action-remove',name: '移除'},
			       {className: 'rs-action-save',name: '保存'},
			       {className: 'rs-action-create',name: '创建'},
			       {className: 'rs-action-clear',name: '清除'},
			       {className: 'rs-action-cancel',name: '取消'},
			       {className: 'rs-action-submit',name: '提交'},]
		});
		
		var tpl = new Ext.XTemplate(
			'<div style="margin:5px 5px 5px 30px;">',
				'<span style="margin:5px 5px 5px 0px;">图标</span>',
				'<span style="padding-left:60px;">描述</span>',
				'<span style="padding-left:120px;">样式</span><br/>',
				
				'<tpl for=".">',
		        	'<div style="margin:5px;"><span class="x-editable" style="padding-left:30px;">{name}</span>',
		        	'<span class="x-editable" style="padding-left:120px;">{className}</span>',
		        	'<div class="{className}" style="float:left;padding-left:30px;"></div></div>',
		        	'</tpl>',
        	'</div>'
		);
		
		
        Rs.apply(config || {},{
        	title: '图标样式',
        	autoScroll: true,
        	items: new Ext.DataView({
        		autoScroll: true,
                store: store,
                tpl: tpl,
                autoHeight:true,
                emptyText: 'No images to display'
            })
        }) ;
        
    	Button.superclass.constructor.apply(this, arguments) ;
	} 
});