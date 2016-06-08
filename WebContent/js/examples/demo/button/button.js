Rs.define('Button' , {

    extend : Ext.Panel ,
    
    mixins : [Rs.app.Main] ,
	
	constructor : function(config){
		
		Ext.QuickTips.init();
		
		var store = new Ext.data.JsonStore({
			fields:['className', 'name'],
			data: [{className: 'rs-action-attribute',name: '���Զ���'},
			       {className: 'rs-action-power',name: 'Ȩ�޶���'},
			       {className: 'rs-action-reset',name: '����'},
			       {className: 'rs-action-ok',name: 'ȷ��'},
			       {className: 'rs-action-seniorquery',name: '�߼���ѯ'},
			       {className: 'rs-action-savedraft',name: '��ݸ�'},
			       {className: 'rs-action-bacthgoleft',name: '��������(����)'},
			       {className: 'rs-action-bacthgoright',name: '��������(����)'},
			       {className: 'rs-action-goleft',name: '����(����)'},
			       {className: 'rs-action-goright',name: '����(����)'},
			       {className: 'rs-action-carryover',name: '��ת'},
			       {className: 'rs-action-submit',name: '�ύ'},
			       {className: 'rs-action-reject',name: '����'},
			       {className: 'rs-action-editfind',name: '�������'},
			       {className: 'rs-action-stop',name: '��ֹ'},
			       {className: 'rs-action-colse',name: '�ر�'},
			       {className: 'rs-action-favorite',name: '�ղ�'},
			       {className: 'rs-action-loseeffect',name: 'ʧЧ'},
			       {className: 'rs-action-effect',name: '��Ч'},
			       {className: 'rs-action-goback',name: '����'},
			       {className: 'rs-action-create',name: '�½�'},
			       {className: 'rs-action-batchdelete',name: 'ɾ��(����)'},
			       {className: 'rs-action-delete',name: 'ɾ��(����)'},
			       {className: 'rs-action-unread',name: 'δ��'},
			       {className: 'rs-action-read',name: '�Ѷ�'},
			       {className: 'rs-action-detail',name: '��ϸ'},
			       {className: 'rs-action-previous',name: '��һ��'},
			       {className: 'rs-action-next',name: '��һ��'},
			       {className: 'rs-action-exporting',name: '������'},
			       {className: 'rs-action-export',name: '����'},
			       {className: 'rs-action-reject',name: '����'},
			       {className: 'rs-action-audit',name: '���'},
			       {className: 'rs-action-rename',name: '������'},
			       {className: 'rs-action-reset',name: '����'},
			       {className: 'rs-action-query',name: '��ѯ'},
			       {className: 'rs-action-querypanel',name: '��ѯ���'},
			       {className: 'rs-action-settings',name: '����'},
			       {className: 'rs-action-apply',name: 'Ӧ��'},
			       {className: 'rs-action-exception',name: '�쳣'},
			       {className: 'rs-action-scheme',name: '���淽��'},
			       {className: 'rs-action-condition',name: '����'},
			       {className: 'rs-action-batch',name: '��������'},
			       {className: 'rs-action-help',name: '����'},
			       {className: 'rs-action-download-disable',name: '����������'},
			       {className: 'rs-action-download-enable',name: '��������'},
			       {className: 'rs-action-modify',name: '�޸�'},
			       {className: 'rs-action-remove',name: '�Ƴ�'},
			       {className: 'rs-action-save',name: '����'},
			       {className: 'rs-action-create',name: '����'},
			       {className: 'rs-action-clear',name: '���'},
			       {className: 'rs-action-cancel',name: 'ȡ��'},
			       {className: 'rs-action-submit',name: '�ύ'},]
		});
		
		var tpl = new Ext.XTemplate(
			'<div style="margin:5px 5px 5px 30px;">',
				'<span style="margin:5px 5px 5px 0px;">ͼ��</span>',
				'<span style="padding-left:60px;">����</span>',
				'<span style="padding-left:120px;">��ʽ</span><br/>',
				
				'<tpl for=".">',
		        	'<div style="margin:5px;"><span class="x-editable" style="padding-left:30px;">{name}</span>',
		        	'<span class="x-editable" style="padding-left:120px;">{className}</span>',
		        	'<div class="{className}" style="float:left;padding-left:30px;"></div></div>',
		        	'</tpl>',
        	'</div>'
		);
		
		
        Rs.apply(config || {},{
        	title: 'ͼ����ʽ',
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