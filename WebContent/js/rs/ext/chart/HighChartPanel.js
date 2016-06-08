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
			var categories = this.categories = [] , //横坐标类别
				series = this.series = [] , //数据
				xAxisField = dynamicConfig.xAxisField ,  //横坐标字段 , 3维图需要配置
				lengedName = dynamicConfig.lengedName ,  // 图例项
				lengedValue = dynamicConfig.lengedValue , // 图例项所对应的值
				store = dynamicConfig.store ;
			
			if(type == 'pie'){
				var pieDatas = [] ; //临时存放饼图数据
				store.each(function(record){
					var flag = true , //标记该图例是否存在
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
			
			var errorMsg = "配置项错误" ;
			
			var store = dynamicConfig && dynamicConfig.store ,
				cfg = config.chartConfig ;
			
			if(!cfg){ //如果没有配置项
				throw errorMsg ;
			}
			
			if(!Ext.isArray(cfg.series) && !store){ //如果配置想中series不是一个数组 , 且也没有配置store
				throw errorMsg ;
			}
			
			if(store && !store instanceof Ext.data.Store){ //如果配置store ,但store 不是一个标准的Store
				throw errorMsg ;
			}
		}
	});
	
	
	rs.high.chart.HighChartPanel = function(config){
		
		if(!config){
			throw "缺少配置项" ;
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
