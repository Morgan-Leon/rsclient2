
Rs.define('rs.test.TestPanel', {

	extend : Ext.Panel,
	
	mixins : [Rs.app.Main],
	
	constructor : function(config){
		
		//����ģ��
		var bill = new Rs.ext.app.Model({
			data : {
				left : '2014/12/12',
				itemCode : 'XXX-FFFF-110',
				itemName : 'XXXDDDD_NNNNNN',
				itemNorm : 'itemNorm-----',
				payWay : 'S'
			}
		});
		
		//��Ƭҳ��
		var card = new Rs.ext.app.CardPanel(bill, {
			//��ͷ
			formHeader : {
				
				left : {
					dataIndex : 'fanghao',
					fieldLabel : '�ֿ�',
					value : '10-00R3-01-0013-0'
				},
				right : {
					dataIndex : 'jingshouren',
					fieldLabel : '������',
					value : 'XXXXXX'
				},
				center : {
					dataIndex : 'biaoti',
					value : '��ⵥ'
				},
				bottom : {
					dataIndex : 'fubiaoti',
					value : 'XX��˾12�ų�Ʒ��'
				}
			},
			
			//�ֶ�
			formBody : {
				fields : [[{
					dataIndex : 'itemCode',
					fieldLabel : '���ϱ���',
					readOnly : true,
					//ռ�п����
					columnWidth: .25
				}, {
					dataIndex : 'itemName',
					fieldLabel : '��������',
					readOnly : true,
					columnWidth: .25
				}, {
					dataIndex : 'itemNorm',
					fieldLabel : '���Ϲ��',
					readOnly : true,
					columnWidth: .25
				}, {
					xtype : 'datefield',
					dataIndex : 'fahuoshijian',
					fieldLabel : '����ʱ��',
					columnWidth : .25,
					format : 'Y/m/d',
	                altFormats:"Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD"
				}], [{
					xtype : 'textarea',
					dataIndex : 'itemMsg',
					fieldLabel : '������Ϣ',
					height : 95,
					columnWidth: 1
				}], [{
					dataIndex : 'itemName',
					allowBlank : false,
					fieldLabel : '��������',
					columnWidth: .4
				}, {
					dataIndex : 'itemNorm',
					fieldLabel : '���Ϲ��',
					columnWidth: .6
				}], [new Rs.ext.form.Telescope({
	                dataIndex : 'kehuXinxi',
					fieldLabel: '�ͻ���Ϣ',
        			singleSelect : true,
        			progCode : 'psVenCusCode',
        			valueField: 'VENDOR_CUSTOMER_CODE',
        			displayField: 'VENDOR_CUSTOMER_NAME',
        			buildProgCondtion : function(condition){
        				return (Ext.isEmpty(condition, false) ? '' : condition + ' and ')
        					+  'company_code=\'01\' and customer_flag = \'Y\' and valid_flag = \'Y\'';
        			},
        			columnWidth: .5
        		}), {
					xtype : 'textfield',
					allowBlank : false,
					dataIndex : 'hetonghao',
                	maxLength: 15,
	                fieldLabel: '��ͬ��',
	                regex : /^[a-z|A-Z|0-9|_]+$/,
					regexText : '��ͬ������ĸ�����֣��»��ߵ����',
					columnWidth : .3
				}, {
					xtype : 'combo',
					readOnly : false,
					dataIndex : 'payWay',
					fieldLabel: '���ʽ',
    				triggerAction : 'all',
    				editable : false,
    				lazyRender : true,
    				mode : 'local',
    				valueField: 'payWay',
    				displayField: 'payWayName',
    				store : new Ext.data.ArrayStore({
    					fields : ['payWay', 'payWayName'],
    					data : [['A', 'һ��ȫ��'],['S', '�ֽ׶θ���']]
    				}),
    				columnWidth: .2,
    				listeners : {
    					'change' : {
    						fn : function(f, v){
    							if(v == 'S'){
    								card.setFieldReadOnly('hetonghao', false);
    								card.setFieldReadOnly('kehuXinxi', false);
    							}else {
    								card.setFieldReadOnly('hetonghao', true);
    								card.setFieldReadOnly('kehuXinxi', true);
    							}
    						},
    						scope : this
    					}
    				}
				}]]
			},
			
			//���½���Ϣ
			formFooter : {
				
				left : {
					fieldLabel : '����',
					dataIndex : 'nianyue',
					value : '2014.09.02'
				},
				
				center : {
					fieldLabel : '��ӡ����',
					dataIndex : 'dayinriqi',
					value : '2014.09.02'
				},
				
				right : {
					fieldLabel : 'ע',
					dataIndex : 'zhu',
					value : '�����45���ڽɷ�'
				}
			}
		});
		
		Ext.apply(config, {
			layout : 'fit',
			tbar : [{
				text : 'save',
				scope : this,
				handler : function(){
					if(card.fieldValidate() != true){
						return;
					}
					alert(Ext.encode(bill.data));
					/*
					bill.save({
						
					}, function(succ, model){
						alert(succ);
					}, this);
					*/
				}
			}, {
				text : 'load',
				scope : this,
				handler : function(){
					bill.load({
						
					}, function(succ, model){
						alert(succ);
					}, this);
				}
			}, {
				text : '����',
				scope : this,
				handler : function(){
					bill.set('fanghao', 'fanghao'+ (new Date()).getTime());
				}
			}, {
				text : '������',
				scope : this,
				handler : function(){
					bill.set('jingshouren', 'jingshouren'+ (new Date()).getTime());
				}
			}, {
				text : '����',
				scope : this,
				handler : function(){
					bill.set('biaoti', 'biaoti'+ (new Date()).getTime());
				}
			}, {
				text : '���ϱ���',
				scope : this,
				handler : function(){
					bill.set('itemCode', 'itemCode'+ (new Date()).getTime());
				}
			}, {
				text : '����ʱ��',
				scope : this,
				handler : function(){
					bill.set('fahuoshijian', '2014/11/11');
				}
			}, {
				text : '����',
				scope : this,
				handler : function(){
					bill.set('nianyue', 'nianyue' + (new Date()).getTime());
				}
			}, {
				text : '��ӡ����',
				scope : this,
				handler : function(){
					bill.set('dayinriqi', 'dayinriqi' + (new Date()).getTime());
				}
			}, {
				text : 'ע:',
				scope : this,
				handler : function(){
					bill.set('zhu', 'zhu' + (new Date()).getTime());
				}
			}, {
				text : '������',
				scope : this,
				handler : function(){
					bill.set('fubiaoti', 'fubiaoti' + (new Date()).getTime());
				}
			}, {
				text : '������Ϣ',
				scope : this,
				handler : function(){
					bill.set('itemMsg', '%u4F60%u597D%0A%u8FD9%u662F%u4E00%u4E2A%u6D4B%u8BD5%0A%u7A0B%u5E8F%0Adddaaaccc' + (new Date()).getTime());
				}
			}],
			
			items : [card],
		});
		
		rs.test.TestPanel.superclass.constructor.apply(this, arguments);
	}

});
