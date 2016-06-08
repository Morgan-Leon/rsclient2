//������WarehouseDefinitionPanel
Rs.define('rs.inv.WarehouseDefinitionPanel', {
    extend: Ext.Panel,//�̳�Ext.Panel,�������Ƕ�׵�ģ��,һ�㶼�̳���Ext.Panel
    mixins: [Rs.app.Main],//��ڵ�����Ҫ���һ����ں���,����java�������е�Main����
    constructor: function(config) {//���췽��
        
    	this.grid = new rs.inv.WarehouseDefinitionGrid({
        	region: 'center'//�������м�
        });
        
        this.query = new rs.inv.WarehouseDefinitionQuery({
            region: 'north',//�����ڱ���
            animCollapse : false,//��������Ƿ񸽴�����Ч��
            grid: this.grid //�ò�ѯ�������grid������
        });
        config = Rs.apply(config || {},
        {	
            layout: 'border',//��������border����
            title : '�ֿⶨ��', //����
            items: [this.grid, this.query] //���������Լ���ѯ��岼����panle��
        });
        rs.inv.WarehouseDefinitionPanel.superclass.constructor.apply(this,arguments);
    }
});
