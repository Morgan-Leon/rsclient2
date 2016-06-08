
Rs.define('rs.test.TestPanel', {

	extend : Ext.Panel,
	
	mixins : [Rs.app.Main],
	
	constructor : function(config){
		
		//数据模型
		var bill = new Rs.ext.app.Model({
			data : {
				left : '2014/12/12',
				itemCode : 'XXX-FFFF-110',
				itemName : 'XXXDDDD_NNNNNN',
				itemNorm : 'itemNorm-----',
				payWay : 'S'
			}
		});
		
		//卡片页面
		var card = new Rs.ext.app.CardPanel(bill, {
			//表单头
			formHeader : {
				
				left : {
					dataIndex : 'fanghao',
					fieldLabel : '仓库',
					value : '10-00R3-01-0013-0'
				},
				right : {
					dataIndex : 'jingshouren',
					fieldLabel : '经手人',
					value : 'XXXXXX'
				},
				center : {
					dataIndex : 'biaoti',
					value : '入库单'
				},
				bottom : {
					dataIndex : 'fubiaoti',
					value : 'XX公司12号成品库'
				}
			},
			
			//字段
			formBody : {
				fields : [[{
					dataIndex : 'itemCode',
					fieldLabel : '物料编码',
					readOnly : true,
					//占行宽比例
					columnWidth: .25
				}, {
					dataIndex : 'itemName',
					fieldLabel : '物料名称',
					readOnly : true,
					columnWidth: .25
				}, {
					dataIndex : 'itemNorm',
					fieldLabel : '物料规格',
					readOnly : true,
					columnWidth: .25
				}, {
					xtype : 'datefield',
					dataIndex : 'fahuoshijian',
					fieldLabel : '发货时间',
					columnWidth : .25,
					format : 'Y/m/d',
	                altFormats:"Y/m/d|Ymd|Y/n/j|Ynj|Y/M/D|YMD"
				}], [{
					xtype : 'textarea',
					dataIndex : 'itemMsg',
					fieldLabel : '物料信息',
					height : 95,
					columnWidth: 1
				}], [{
					dataIndex : 'itemName',
					allowBlank : false,
					fieldLabel : '物料名称',
					columnWidth: .4
				}, {
					dataIndex : 'itemNorm',
					fieldLabel : '物料规格',
					columnWidth: .6
				}], [new Rs.ext.form.Telescope({
	                dataIndex : 'kehuXinxi',
					fieldLabel: '客户信息',
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
	                fieldLabel: '合同号',
	                regex : /^[a-z|A-Z|0-9|_]+$/,
					regexText : '合同号由字母，数字，下划线等组成',
					columnWidth : .3
				}, {
					xtype : 'combo',
					readOnly : false,
					dataIndex : 'payWay',
					fieldLabel: '付款方式',
    				triggerAction : 'all',
    				editable : false,
    				lazyRender : true,
    				mode : 'local',
    				valueField: 'payWay',
    				displayField: 'payWayName',
    				store : new Ext.data.ArrayStore({
    					fields : ['payWay', 'payWayName'],
    					data : [['A', '一次全付'],['S', '分阶段付款']]
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
			
			//右下角信息
			formFooter : {
				
				left : {
					fieldLabel : '年月',
					dataIndex : 'nianyue',
					value : '2014.09.02'
				},
				
				center : {
					fieldLabel : '打印日期',
					dataIndex : 'dayinriqi',
					value : '2014.09.02'
				},
				
				right : {
					fieldLabel : '注',
					dataIndex : 'zhu',
					value : '务必在45天内缴费'
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
				text : '房号',
				scope : this,
				handler : function(){
					bill.set('fanghao', 'fanghao'+ (new Date()).getTime());
				}
			}, {
				text : '经手人',
				scope : this,
				handler : function(){
					bill.set('jingshouren', 'jingshouren'+ (new Date()).getTime());
				}
			}, {
				text : '标题',
				scope : this,
				handler : function(){
					bill.set('biaoti', 'biaoti'+ (new Date()).getTime());
				}
			}, {
				text : '物料编码',
				scope : this,
				handler : function(){
					bill.set('itemCode', 'itemCode'+ (new Date()).getTime());
				}
			}, {
				text : '发货时间',
				scope : this,
				handler : function(){
					bill.set('fahuoshijian', '2014/11/11');
				}
			}, {
				text : '年月',
				scope : this,
				handler : function(){
					bill.set('nianyue', 'nianyue' + (new Date()).getTime());
				}
			}, {
				text : '打印日期',
				scope : this,
				handler : function(){
					bill.set('dayinriqi', 'dayinriqi' + (new Date()).getTime());
				}
			}, {
				text : '注:',
				scope : this,
				handler : function(){
					bill.set('zhu', 'zhu' + (new Date()).getTime());
				}
			}, {
				text : '副标题',
				scope : this,
				handler : function(){
					bill.set('fubiaoti', 'fubiaoti' + (new Date()).getTime());
				}
			}, {
				text : '物料信息',
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
