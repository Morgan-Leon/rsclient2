Ext.ns("Rs.ext.mxgraph");

(function(){
	
	/**
	 * 静态样式表
	 */
	var start = {}, end,
		disabled = {},
		waiting = {},
		running = {},
		completed = {};
	
	start[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
	start[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
	start[mxConstants.STYLE_STROKECOLOR] = 'gray';
	start[mxConstants.STYLE_FONTCOLOR] = 'gray';
	start[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
	start[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
	start[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	start[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	start[mxConstants.STYLE_FONTSIZE] = '12';
	start[mxConstants.STYLE_FONTSTYLE] = 1;
	
	end = mxUtils.clone(start);
	end[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
	end[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
	end[mxConstants.STYLE_STROKEWIDTH] = 3;
	
	disabled[mxConstants.STYLE_FILLCOLOR] = '#A9A9A9';
	disabled[mxConstants.STYLE_GRADIENTCOLOR] = '#C0C0C0';
	disabled[mxConstants.STYLE_FONTCOLOR] = '#DCDCDC';
	
	waiting[mxConstants.STYLE_FILLCOLOR] = '#FFFF10';
	running[mxConstants.STYLE_FILLCOLOR] = '#2DFF2C'; 
	
	completed[mxConstants.STYLE_FILLCOLOR] = '#FAEBD7';// '#FFAF1B';
	completed[mxConstants.STYLE_GRADIENTCOLOR] = '#FAEBD7';
	
	var STATESTYLE = {
		'start' : {
		    name : '开始',
		    style : start
	    },
		'end' : {
	    	name : '结束',
	    	style : end
	    },
		'disabled' : {
	    	name : '不可达',
	    	style : disabled 
	    },
		'waiting' : {
	    	name : '等待中',
	    	style : waiting 
	    },
		'running' : {
	    	name : '运行中',
	    	style : running 
	    },
		'completed' : {
	    	name : '已完成',
	    	style : completed 
	    }
	};
	
	/**
	 * @class Rs.ext.mxgraph.RsGraph
	 * 流程图类
	 * @extend Ext.util.Observable
	 * @constructor {Object} config
	 */
	Rs.ext.mxgraph.RsGraph = function(config){
		if (!mxClient.isBrowserSupported()) {
			mxUtils.error('Browser is not supported!', 200, false);
		}
		Ext.apply(this, config);
		Rs.ext.mxgraph.RsGraph.superclass.constructor.call(this);
		
		this.addEvents(
			'beforerender',
			
			'render',
			
			'afterrender', 
			
			'dblclick',
			
			'click', 
			
			'cellclick',
			
			'vertexclick',
			
			'edgeclick',
			
			'mousemove',
			
			'mouseup',
			
			'mousedown'
		);
		var graph = new mxGraph();
		this.graph = this.initGraph(graph);
    	this.graphTracker = this.initDefaultCellTracker(graph);
    	this.graphLayout = this.initDefaultLayout(graph);
    	this.graphHighLight = this.initDefaultHighlight(graph);
    	this.graphStyleSheet = this.initDefaultStyle(graph);
	};
	
	Ext.extend(Rs.ext.mxgraph.RsGraph, Ext.util.Observable, {
		
		/**
		 * @cfg {Boolean} connectable
		 */
		connectable : true,
		
		/**
		 * @cfg {Boolean} tooltips
		 * 显示提示
		 */
		tooltips : true,
		
		/**
		 * 
		 * @cfg {String} backgroundImage 
		 */
		enabled : false,
		
		labelsVisible : true,
		
		cellLocked : true,
		
		cellsMovable : true,
		
		gridEnabled : true,
		
		pan : true, 
		
		dropEnabled : true, 
		
		afterRender : Ext.emptyFn,
		/**
		 * 
		 * @cfg {String} waitingImage 用于标识处于等待状态节点的图标
		 */
		waitingImage : new mxImage(mxClient.imageBasePath + '/waiting.png', 16, 16),
		
		/**
		 * 
		 * @cfg {String} waitingImage 用于标识处于运行状态节点的图标
		 */
		runningImage : new mxImage(mxClient.imageBasePath + '/running.png', 16, 16),
		
		/**
		 * 
		 * @cfg {String} waitingImage 用于标识已经运行完成节点的图标
		 */
		completedImage : new mxImage(mxClient.imageBasePath + '/completed.png', 16, 16),
		
		//private
		initGraph : function(graph){
			graph.setConnectable(this.connectable === true);
			graph.setTooltips(this.tooltips === true);
			if(Ext.isEmpty(this.backgroundImage, false) 
				&& Ext.isString(this.backgroundImage)){
				graph.setBackgroundImage(this.backgroundImage);
			}
			graph.setEnabled(this.enabled === true);
			graph.setCellsLocked(this.setCellsLocked === true);
			graph.setCellsMovable(this.cellsMovable === true);
			graph.setGridEnabled(this.gridEnabled === true);
	    	graph.setDropEnabled(this.dropEnabled === true);
	        graph.setPanning(this.pan === true);
	        graph.labelsVisible = this.labelsVisible === true;
	        
	        graph.isHtmlLabel = this.isHtmlLabel.createDelegate(this);
	        graph.getTooltipForCell = this.getTooltipForCell.createDelegate(this);
	        
	        return graph;
		},
		
		//priavte
		initDefaultCellTracker : function(graph){
			return new mxCellTracker(graph);
		},
		
		//private
		initDefaultLayout : function(graph){
			return new mxCompactTreeLayout(graph);
		},
		
		//private
		initDefaultHighlight : function(graph){
			return new mxCellHighlight(graph);
		},
		
		//private
		initDefaultStyle : function(graph){
			var styleSheet = graph.getStylesheet();
			this.initDefayltVertexStyle(graph);
			this.initDefaultEdgeStyle(graph);
			for(var name in STATESTYLE){
				styleSheet.putCellStyle(name, STATESTYLE[name]['style']);
			}
	        return styleSheet;
		},
		
		//private
		initDefayltVertexStyle : function(graph){
			var style = graph.getStylesheet().getDefaultVertexStyle();
			style[mxConstants.STYLE_STROKECOLOR] = 'gray';
			style[mxConstants.STYLE_FILLCOLOR] = '#DFDFDF';
			style[mxConstants.STYLE_SPACING] = 4;
			style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ROUNDED;
	        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
	        style[mxConstants.STYLE_PERIMETER_SPACING] = 4;
	        style[mxConstants.STYLE_SHADOW] = true;
	        style[mxConstants.STYLE_FONTSIZE] = '12';
			style[mxConstants.STYLE_FONTCOLOR] = 'black';
			style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_WEST;
			style[mxConstants.STYLE_ROUNDED] = true;
		},
		
		//private
		initDefaultEdgeStyle : function(graph){
			var style = graph.getStylesheet().getDefaultEdgeStyle();
	        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
	        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
			style[mxConstants.STYLE_STROKECOLOR] = 'black';
			style[mxConstants.STYLE_ROUNDED] = true;
		},
		
		//private
		render : function(container){
			if(!this.rendered && this.fireEvent('beforerender', this) !== false){
				this.container = container;
				this.rendered = true;
				this.onRender(this.container);
				this.fireEvent('render', this);
				this.afterRender(this.container);
				this.fireEvent('afterrender', this);
				return this;
			}
		}, 
		
		//private
		onRender : function(container){
			this.graph.init(container);
			this.initGraphEvents();
			if(this.jsonData != undefined){
				this.loadData(this.jsonData);
			}else if(this.xmlData != undefined){
				this.loadXmlData(this.xmlData);
			}
		},
		
		/**
		 * 判断节点是否是htmlLabel
		 * 
		 * @method isHtmlLabel 
		 * @param {Cell} cell
		 */
		isHtmlLabel : function(cell){
			return false;
		},
		
		/**
		 * 获取 tooltip
		 * 
		 * @method getTooltipForCell
		 * @return {String} tooltip
		 */
		getTooltipForCell : function(cell){
            var tip = '', 
                name = this.getStyleName(cell);
            if(cell != null && !Ext.isEmpty(cell.tooltip, false)){
                tip = cell.tooltip;
			}else {
				if (cell != null && cell.getTooltip != null) {
	            	tip = cell.getTooltip();
			    } else {
			    	var graph = this.graph;
			        tip = graph.convertValueToString(cell);
			    }
			}
		    return name + " " + tip;
		},
		
		//private
		getStyleName : function(cell){
			if(cell != undefined){
				var style = STATESTYLE[cell.getStyle()];
	        	return style != undefined ? style.name : '';
			}else {
				return '';
			}
		},
		
		//private
	    initGraphEvents : function(){
	    	var graph = this.graph;
	    	if(graph != undefined){
	    		graph.dblClick =  graph.dblClick.createSequence(function(evt, cell){
	    			this.fireEvent('dblclick', this, graph, cell);
	    		}, this);
		        graph.click = graph.click.createSequence(function (me) {
		        	var cell = me.getCell();
		        	this.fireEvent('click', this, graph);
		        	if(cell != undefined){
		        		if(cell.isVertex()){
		        			this.fireEvent('vertexclick', this, graph, cell);
		        		}else if(cell.isEdge()){
		        			this.fireEvent('edgeclick', this, graph, cell);
		        		}
		        	}
		        }, this);
		        var tracker = this.graphTracker;
		    	if(tracker != undefined){
		    		tracker.mouseMove = tracker.mouseMove.createSequence(function(sender, me){
		    			this.fireEvent('mousemove', this, sender, me, me.getCell());
		    		}, this);
		    		tracker.mouseUp = tracker.mouseUp.createSequence(function(sender, me){
		    			this.fireEvent('mouseup', this, sender, me, me.getCell());
		    		}, this);
		    		tracker.mouseDown = tracker.mouseDown.createSequence(function(sender, me){
		    			this.fireEvent('mousedown', this, sender, me, me.getCell());
		    		}, this);
		    	}
	    	}
	    },
		
		/**
		 * 
		 * @method loadData
		 */
		loadData : function(data){
			var graph = this.graph;
			if(!graph){
				throw 'graph is null';
			}
			if(!data){
				throw 'data is null';
			}
			this.removeAllCells();
			var model = graph.getModel(), 
				parent = graph.getDefaultParent(),
				vs = data.vertices ? data.vertices instanceof Array ? data.vertices : [data.vertices] : [],
				vertices = {}, edges = {},
				es = data.edges ? data.edges instanceof Array ? data.edges : [data.edges] : [],
				current = data.current;
			graph.getModel().beginUpdate();
			try {
				for(var i = 0, l = vs.length; i < l; i++){
					var v = vs[i] || {},
					    value = v.value,
					    x = v.x || 0,
					    y = v.y || 0,
					    width = v.width || 40,
					    height = v.height || 40,
					    style = v.style;
					var vertex = graph.insertVertex(parent, null, value, x, y, width, height, style),
						id = !Ext.isEmpty(v.id, false) ? v.id : Ext.id();
					vertex.setId(id);
					vertex.tooltip = v.tooltip;
					vertices[id] = vertex;
				}
				for(var i = 0, l = es.length; i < l; i++){
					var e = es[i] || {},
					    value  = e.value,
					    source = vertices[e.source],
					    target = vertices[e.target],
					    style = e.style;
					if(source != undefined && target != undefined){
						var edge = graph.insertEdge(parent, null, value, source, target),
							id = !Ext.isEmpty(e.id, false) ? e.id : Ext.id();
						edge.setId(id);
						edge.tooltip = e.tooltip;
						edges[id] = edge;
					}
				}
				this.jsonData = data;
				this.graphVertices = vertices;
				this.graphEdges = edges;
			} finally {
	            graph.getModel().endUpdate();
	        }
		}, 
		
		/**
		 * 加载XML数据
		 * 
		 * @method loadXmlData
		 */
		loadXmlData : function(xml){
			var doc = mxUtils.parseXml(xml),
				codec = new mxCodec(doc);
			codec.decode(doc.documentElement, this.graph.getModel());
		},
		
		
		/**
		 * 设置当前活跃节点
		 * 
		 */
		setCellWaiting : function(id, msg, time){
			var cell = this.getCellById(id);
			if(cell != undefined){
				msg = Ext.isEmpty(msg) ? "" : msg;
				var graph = this.graph,
					overlay = new mxCellOverlay(this.waitingImage, 
						'<font color=red>' + msg + '</font>');
				graph.addCellOverlay(cell, overlay);
				graph.setCellStyle.defer(100, graph, ['waiting', [cell]]);
				if(Ext.isNumber(time)){
					(function(graph, cell){
						graph.clearCellOverlays(cell);
					}).defer(time * 1000, this, [graph, cell]);
				}
			}
		},
		
		/**
		 * 设置当前运行的节点
		 * 
		 * @method setCellRunning
		 * @param {String} id,
		 * @param {String} time
		 */
		setCellRunning : function(id, msg, stopOthers, time){
			var cell = this.getCellById(id);
			if(cell != undefined){
				msg = Ext.isEmpty(msg) ? "" : msg;
				var graph = this.graph,
					overlay = new mxCellOverlay(this.runningImage, 
						'<font color=red>' + msg + '</font>');
				graph.addCellOverlay(cell, overlay);
				graph.setCellStyle.defer(100, graph, ['running', [cell]]);
				if(Ext.isNumber(time)){
					(function(graph, cell){
						graph.clearCellOverlays(cell);
					}).defer(time * 1000, this, [graph, cell]);
				}
			}
		},
		
		/**
		 * 设置节点已经运行完毕
		 * 
		 * @method setCellCompleted
		 * @param {String} id
		 * @param {String} msg 
		 */
		setCellCompleted : function(id, msg, time){
			var cell = this.getCellById(id);
			if(cell != undefined){
				msg = Ext.isEmpty(msg) ? "" : msg;
				var graph = this.graph,
					overlay = new mxCellOverlay(this.completedImage, 
						'<font color=red>' + msg + '</font>');
				graph.addCellOverlay(cell, overlay);
				graph.setCellStyle.defer(100, graph, ['completed', [cell]]);
				if(Ext.isNumber(time)){
					(function(graph, cell){
						graph.clearCellOverlays(cell);
					}).defer(time * 1000, this, [graph, cell]);
				}
			}
		},
		
		/**
		 * 设置节点处于警告状态
		 * 
		 * @method setCellWarning
		 * @param {String} id
		 * @param {String} msg
		 * @param {Number} time 
		 */
		setCellWarning : function(id, msg, time){
			var cell = this.getCellById(id);
			if(cell != undefined){
				var	graph = this.graph,
					overlays = graph.getCellOverlays(cell);
				if (overlays == null) {
					graph.setCellWarning(cell, msg || '');
				}
				if(Ext.isNumber(time)){
					(function(graph, cell){
						graph.clearCellOverlays(cell);
					}).defer(time * 1000, this, [graph, cell]);
				}
			}
		},
		
		/**
		 * 获取所有节点
		 * 
		 * @method getAllVertices
		 * @return {Array} vertices
		 */
		getAllVertices : function(){
			var map = this.graphVertices,
				vertices = [];
			for(var k in map){
				vertices.push(map[k]);
			}
			return vertices;
		},
		
		/**
		 * 获取所有节点
		 * 
		 * @method getAllEdges
		 * @return {Array} edges
		 */
		getAllEdges : function(){
			var map = this.graphEdges,
			    edges = [];
			for(var k in map){
				edges.push(map[k]);
			}
			return edges;
		},
		
		/**
		 * 获取所有节点和连线
		 * 
		 * @method getAllCells
		 * @return {Array} cells;
		 */
		getAllCells : function(){
			return this.getAllVertices().concat(this.getAllEdges());
		},
		
		/**
		 * 获取Cell by Id
		 * 
		 * @method getCellById
		 * @return {Cell} cell 
		 */
		getCellById : function(id){
			var vs = this.graphVertices || {},
			    v = vs[id];
			if(v !== undefined){
				return v;
			}else {
				var es = this.graphEdges || {};
				return es[id];
			}
		},
		
		/**
		 * 删除所有节点(包括每个节点上的所有连线)
		 * 
		 * @method removeAllCells
		 */
		removeAllCells : function(includeEdges){
			var graph = this.graph;
			if(graph != undefined){
				includeEdges = includeEdges !== false;
				graph.removeCells(this.getAllVertices(), includeEdges);
			}
		}, 
		
		
		
		/**
		 * 设置节点样式
		 * 
		 * @method putVertexStyle
		 * @param {String} name
		 * @param {String} style 
		 */
		putVertexStyle : function(name, style){
			var vertexStyle = this.graphStyleSheet.getDefaultVertexStyle();
			vertexStyle[name] = style;
		},
		
		/**
		 * 设置连线样式
		 * 
		 * @method putEdgeStyle
		 * @param {String} name
		 * @param {String} style
		 */
		putEdgeStyle : function(name, style){
			var edgeStyle = this.graphStyleSheet.getDefaultEdgeStyle();
			edgeStyle[name] = style;
		},
		
		/**
		 * 设置样式
		 * 
		 * @method putCellStyle
		 * @param {String} name
		 * @param {Array} style
		 */
		putCellStyle : function(name, style){
			this.graphStyleSheet.putCellStyle(name, style);
		},
		
		/**
		 * 高亮
		 * 
		 * @method graphRun
		 * @param {Array} line 要高亮的节点和连线的ID数组
		 */
		highLightCells : function(line){
			line = line != undefined ? line instanceof Array ? line : [line] : [];
			var cells = [],
				view = this.graph.getView(),
				parent = this.graph.getDefaultParent();
			for(var i = 0, l = line.length; i < l; i++){
				var cell = this.getCellById(line[i]);
				if(cell !== undefined){
					cells.push(cell);
				}
			}
			var task = {
			    run: function(){
					var cell = cells.shift();
					if(cell != undefined){
						this.graphHighLight.highlight(view.getState(cell));
					}else {
						Ext.TaskMgr.stop(task);
						this.graphHighLight.hide();
					}
				},
				scope : this,
		    	interval: 800
			};
			Ext.TaskMgr.stopAll();
			Ext.TaskMgr.start(task);
		},
		
		/**
		 * 
		 */
		syncSize : function(){
			this.graph.sizeDidChange();
		},
		
		/**
		 * 
		 * 
		 * @method executeLayout
		 * @param {Layout} layout
		 * @param {Boolean} animate
		 */
		executeLayout : function(layout, animate, ignoreChildCount) {
			var graph = this.graph, 
			    cell = graph.getSelectionCell();
			if (cell == null || (!ignoreChildCount && graph.getModel().getChildCount(cell) == 0)) {
				cell = graph.getDefaultParent();
			}
			graph.getModel().beginUpdate();
			try {
				layout.execute(cell);
			} catch (e) {
				throw e;
			} finally {
				if (animate && navigator.userAgent.indexOf('Camino') < 0) {
					var morph = new mxMorphing(graph);
					morph.addListener(mxEvent.DONE, function() {
						graph.getModel().endUpdate();
					});
					morph.startAnimation();
				} else {
					graph.getModel().endUpdate();
				}
			}
		},
		
		
		//private
		destroy : function(){
			if(this.graphTracker){
				this.graphTracker.destroy();
			}
			if(this.graphHihgLight){
				this.graphHihgLight.destroy();
			}
			if(this.graphLayout){
				this.graphLayout.destroy();
			}
			if(this.graph){
				this.graph.destroy();
			}
			this.graphVertices = null;
			this.graphEdges = null;
		}
	
	});
	
})();