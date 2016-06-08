Ext.ns('rs.high.chart') ;
(function(){
	rs.high.chart.HighChartData = function(config , dynamicConfig){
		
		this.validata(config , dynamicConfig) ;
		
		if(dynamicConfig && dynamicConfig.store){
			this.formatChartData(dynamicConfig , config.chartConfig.chart.type || 'column') ;
		}
		
		Rs.apply(this , config) ;
		
		rs.high.chart.HighChartData.superclass.constructor.apply(this , arguments);
	}
	
	Ext.extend(rs.high.chart.HighChartData ,Ext.util.Observable , {
		
		getData :function(){
			if(this.chartConfig.chart.type === 'pie'){
				Rs.apply(this.chartConfig , {
					series : this.series
				});
			} else {
				Rs.apply(this.chartConfig , {
					series : this.series
				});
				
				Rs.apply(this.chartConfig.xAxis , {
					categories : this.categories
				});
			}
			return  this.chartConfig ;
		} ,
		
		formatChartData : function(dynamicConfig , type){
			var categories = this.categories = [] , //���������
				series = this.series = [] , //����
				xAxisField = dynamicConfig.xAxisField ,  //�������ֶ� , 3άͼ��Ҫ����
				lengedName = dynamicConfig.lengedName ,  // ͼ����
				lengedValue = dynamicConfig.lengedValue , // ͼ��������Ӧ��ֵ
				store = dynamicConfig.store ;
			
			if(type == 'pie'){
				var pieDatas = [] ; //��ʱ��ű�ͼ����
				store.each(function(record){
					var flag = true , //��Ǹ�ͼ���Ƿ����
						name = record.get(lengedName) ,
						value = record.get(lengedValue) ;
					if(!isNaN(value)){
						value = parseFloat(value) ;
					} else {
						value = null ;
					}
					Ext.each(pieDatas , function(pieData){
						if(pieData.name === name){
							flag = false ;
							pieData.value += value ;
						}
					} , this);
					
					if(flag){
						pieDatas.push({
							name : name ,
							value : value
						});
					}
				} , this);
				
				var data = [] ;
				
				Ext.each(pieDatas , function(pieData){
					data.push([pieData['name'] , pieData['value']]);
				} , this); 
				
				series.push({
					name : '' ,
					data : data
				});
				
			} else {
				
				store.each(function(record){
					var xfield = record.get(xAxisField) ,
						name = record.get(lengedName) ,
						value = record.get(lengedValue) ;
					
					if(categories.indexOf(xfield) == -1 ){
						categories.push(xfield);
					}
				} , this) ;
				
				store.each(function(record){
					var flag = true ,
						xfield = record.get(xAxisField) ,
						name = record.get(lengedName) ,
						value = record.get(lengedValue) ;
					
					if(Ext.isEmpty(value)){
						return ;
					}
					if(isNaN(value)){
						return ;
					}
					value = parseFloat(value) ;
					
					Ext.each(series , function(sery){
						if(sery.name === name){
							flag = false ;
							sery.data[categories.indexOf(xfield)] = value ;
						}
					} , this);
					
					if(flag){
						//var data = new Array(categories.length) ;
						var data = [] ;
						for(var i=0,len=categories.length;i<len;i++){
							data[i] = null ;
						}
						data[categories.indexOf(xfield)] = value ;
						series.push({
							name : name ,
							data : data 
						});
					}
				} , this);
			}
		} ,
		
		validata : function(config , dynamicConfig){
			
			var errorMsg = "���������" ;
			
			var store = dynamicConfig && dynamicConfig.store ,
				cfg = config.chartConfig ;
			
			if(!cfg){ //���û��������
				throw errorMsg ;
			}
			
			if(!Ext.isArray(cfg.series) && !store){ //�����������series����һ������ , ��Ҳû������store
				throw errorMsg ;
			}
			
			if(store && !store instanceof Ext.data.Store){ //�������store ,��store ����һ����׼��Store
				throw errorMsg ;
			}
		}
	});
	
	
	rs.high.chart.HighChartPanel = function(config){
		
		if(!config){
			throw "ȱ��������" ;
		}
		
		Rs.apply(this.chartConfig , config);
		
		rs.high.chart.HighChartPanel.superclass.constructor.apply(this , arguments) ;
		
	} ;
	
	Ext.extend(rs.high.chart.HighChartPanel , Ext.Panel , {
		
		layout : 'fit' ,
		
		chartConfig : {}  ,
		
		onRender : function(ct, position){
			
			rs.high.chart.HighChartPanel.superclass.onRender.call(this, ct, position) ;
			
			var el = this.el ;
			
			if(!this.chartConfig.chart){
				this.chartConfig.chart = {} ;
			}
			this.el.dom.style.width = '100%' ;
			this.el.dom.style.height = '100%' ;
			Ext.apply(this.chartConfig.chart , {
				renderTo : this.el.dom
			});
			var chart = new Highcharts.Chart(this.chartConfig) ;
		}
	});
})() ;
